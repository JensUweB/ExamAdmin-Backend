import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let token: string;
  let user;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useStaticAssets(join(__dirname, '/..', '/src/upload'));
    app.setBaseViewsDir(join(__dirname, '/..', '/src/views'));
    app.setViewEngine('hbs');
    await app.init();
  });
  
  afterAll(async () => {
    return await app.close();
  });
  
  // Testing Auth Module
  describe('Auth Module', () => {
    it('login', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          variables: {},
          query: `{login(email: "karl.marx@localhost", password: "123456")
          {token, tokenExpireDate, user{_id, firstName, lastName}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.login).toBeTruthy();
          expect(body.data.login.token).toBeTruthy();
          token = body.data.login.token;
          user = body.data.login.user;
        });
    });
    it('login (wrong credentials)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          variables: {},
          query: `{login(email: "karl.marx@localhost", password: "admin")
          {token, tokenExpireDate, user{_id, firstName, lastName}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log('login (wrong credentials): '+JSON.stringify(body));
          expect(body.errors[0].message.statusCode).toBe(401);
        });
    });
    it('forgotPassword (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          variables: {},
          query: `mutation{forgotPassword(email: "tester@localhost")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeDefined();
        });
    });
    it('auth/forgot-password/ (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/auth/forgot-password/'+token)
        .expect(HttpStatus.OK);
    });
  });

  //Testing User Module
  describe('User Module', () => {
    it('getUser (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getUser{firstName, martialArts{name}, clubs{club{name}}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getUser).toBeTruthy();
          expect(body.data.getUser.firstName).toBeTruthy();
          expect(body.data.getUser.martialArts).toBeTruthy();
          expect(body.data.getUser.clubs).toBeTruthy();
        });
    });
    it('getUser (UnAuthorized Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token + 'invalid-token-test')
        .send({
          operationName: null,
          variables: {},
          query: `{getUser{_id, firstName, lastName, email}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log('getUser: '+JSON.stringify(body));
          expect(body.errors).toBeTruthy();
        });
    });
    it('updateUser (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{updateUser(input:
            {firstName: "E2E",lastName:"Test"})
            {_id, firstName, lastName}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log('updateUser: '+JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.addUserToClub).toBeTruthy();
          expect(body.data.addUserToClub._id).toBeTruthy();
          expect(body.data.addUserToClub.firstName).toBe('E2E');
          expect(body.data.addUserToClub.lastName).toBe('Test');
        });
    });
    it('addUserToClub (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addUserToClub(clubId: "5e1306132002aa4ff88620a1")
                    {_id, firstName, clubs{club{name}}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log('addUserToClub: '+JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.addUserToClub).toBeTruthy();
          expect(body.data.addUserToClub._id).toBeTruthy();
          expect(body.data.addUserToClub.firstName).toBeTruthy();
          expect(body.data.addUserToClub.clubs).toBeTruthy();
          expect(body.data.addUserToClub.clubs[0].club).toBeTruthy();
          expect(body.data.addUserToClub.clubs[0].club.name).toBeTruthy();
        });
    });
    it('addUserToClub (Mutation | Duplicate Test)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addUserToClub(clubId: "5e1306132002aa4ff88620a1")
                    {_id, firstName, clubs{club{name}}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).not.toBeTruthy();
          expect(body.errors).toBeTruthy();
          expect(body.errors[0].message).toBe("User is already a member of this club!");
        });
    });
    it('removeUserFromClub (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{removeUserFromClub(clubId: "5e1306132002aa4ff88620a1")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.removeUserFromClub).toBeTruthy();
        });
    });
    it('addMartialArtRankToUser (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addMartialArtRankToUser(rankId: "5e1323f45521bf49046ca86c")
          {firstName, martialArts{_id}, clubs{club{_id}}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.addMartialArtRankToUser).toBeTruthy();
          expect(body.data.addMartialArtRankToUser.firstName).toBeTruthy();
          expect(body.data.addMartialArtRankToUser.martialArts).toBeTruthy();
          expect(body.data.addMartialArtRankToUser.clubs).toBeTruthy();
        });
    });
    it('addMartialArtRankToUser (Mutation | Duplicate Test)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addMartialArtRankToUser(rankId: "5e1323f45521bf49046ca86c")
          {firstName, martialArts{_id}, clubs{club{_id}}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).not.toBeTruthy();
          expect(body.errors).toBeTruthy();
        });
    });
    it('addMartialArtRankToUser (Mutation | Override Test)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addMartialArtRankToUser(rankId: "5e1323f45521bf49046ca86b")
          {firstName, martialArts{_id}, clubs{club{_id}}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.addMartialArtRankToUser).toBeTruthy();
          expect(body.data.addMartialArtRankToUser.firstName).toBeTruthy();
          expect(body.data.addMartialArtRankToUser.martialArts).toBeTruthy();
          expect(body.data.addMartialArtRankToUser.clubs).toBeTruthy();
        });
    });
    /* it('deleteUser (Mutation)', async () => { return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteUser}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.deleteUser).toBeTruthy();
        });
    }); */
  });

  // Testing Club Module
  describe('Club Module', () => {
    let clubId: string;
    it('createClub (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createClub(input:{
              name: "E2ETest e.V."
                registrationId: "REG-E2ETest"
                street: "E2ETestStreet 123"
                zip: "12345"
                city: "E2ETestCity"
                country: "Germany"
                martialArts: ["5e1325565521bf49046ca86d"]
                admins: ["${user._id}"]})
            { _id, name}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.createClub._id).toBeTruthy();
          expect(body.data.createClub.name).toBeTruthy();
          clubId = body.data.createClub._id;
        });
    });
    it('createClub (Mutation | Duplicate Test)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createClub(input:{
              name: "E2ETest e.V."
                registrationId: "REG-E2ETest"
                street: "E2ETestStreet 123"
                zip: "12345"
                city: "E2ETestCity"
                country: "Germany"
                martialArts: ["5e1325565521bf49046ca86d"]
                admins: ["${user._id}"]})
            { _id, name}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).not.toBeTruthy();
          expect(body.errors).toBeTruthy();
        });
    });
    it('addClubAdmin (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addClubAdmin(clubId: "${clubId}", userId: "5e1c9385ac96ef12044e259b")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.addClubAdmin).toBeTruthy();
        });
    });
    it('getAllClubMembers (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getAllClubMembers(clubId: "5e207ca41aa0f630b099c1fd"){_id, firstName, lastName, martialArts{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log('getAllClubMembers: '+JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.getAllClubMembers).toBeTruthy();
          expect(body.data.getAllClubMembers[0].firstName).toBeTruthy();
          expect(body.data.getAllClubMembers[0].martialArts).toBeTruthy();
        });
    });
    it('getAllClubs (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getAllClubs{
                _id, name, country, 
              martialArts{name, styleName},
              admins{firstName, lastName} }}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeDefined();
          expect(body.data.getAllClubs).toBeDefined();
        });
    });
    it('deleteClub (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteClub(clubId: "${clubId}")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.deleteClub).toBeTruthy();        
        });
    });
  });

  // Testing MartialArts Module
  describe('MartialArts Module', () => {
    it('getAllMartialArts (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getAllMartialArts{_id}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getAllMartialArts).toBeTruthy();
        });
    });
    it('getMartialArtById (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getMartialArtById(id: "5e1323f45521bf49046ca85c")
          {_id, name, examiners{_id}, ranks{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getMartialArtById).toBeTruthy();
          expect(body.data.getMartialArtById.name).toBeTruthy();
          expect(body.data.getMartialArtById.examiners).toBeTruthy();
          expect(body.data.getMartialArtById.ranks).toBeTruthy();
        });
    });
    it('getMartialArtByRank (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getMartialArtByRank(rankId: "5e1323f45521bf49046ca862")
          {_id, name, examiners{_id}, ranks{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getMartialArtByRank).toBeTruthy();
          expect(body.data.getMartialArtByRank.name).toBeTruthy();
          expect(body.data.getMartialArtByRank.examiners).toBeTruthy();
          expect(body.data.getMartialArtByRank.ranks).toBeTruthy();
        });
    });
    it('getRank (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getRank(rankId: "5e1323f45521bf49046ca862")
          {_id, name, number}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getRank).toBeTruthy();
          expect(body.data.getRank._id).toBeTruthy();
          expect(body.data.getRank.name).toBeTruthy();
          expect(body.data.getRank.number).toBeTruthy();
        });
    });
    let maId: string;
    let maId2: string;
    it('createMartialArt (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createMartialArt(input:{
            name:"E2Test",styleName:"E2ETest Ryu",
            ranks:[{name:"rank1", number:1},{name:"rank2",number:2}]
            examiners:["${user._id}"]}){_id,name,ranks{name, number}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.createMartialArt).toBeTruthy();
          expect(body.data.createMartialArt._id).toBeTruthy();
          expect(body.data.createMartialArt.name).toBeTruthy();
          expect(body.data.createMartialArt.ranks).toBeTruthy();
          maId = body.data.createMartialArt._id;
        });
    });
    it('createMartialArt (Mutation | Duplicate Test)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createMartialArt(input:{
            name:"E2Test",styleName:"E2ETest Ryu",
            ranks:[{name:"rank1", number:1},{name:"rank2",number:2}]
            examiners:["${user._id}"]}){_id,name,ranks{name, number}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).not.toBeTruthy();
          expect(body.errors).toBeTruthy();
        });
    });
    it('createMartialArt (Mutation | Other StyleName)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createMartialArt(input:{
            name:"E2Test",styleName:"Some Other Style Ryu",
            ranks:[{name:"rank1", number:1},{name:"rank2",number:2}]
            examiners:["${user._id}"]}){_id,name,ranks{name, number}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.createMartialArt).toBeTruthy();
          expect(body.data.createMartialArt._id).toBeTruthy();
          expect(body.data.createMartialArt.name).toBeTruthy();
          expect(body.data.createMartialArt.ranks).toBeTruthy();
          maId2 = body.data.createMartialArt._id;
        });
    });
    it('deleteMartialArt-1 (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteMartialArt(id: "${maId}")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.deleteMartialArt).toBeTruthy();
        });
    });
    it('deleteMartialArt-2 (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteMartialArt(id: "${maId2}")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.deleteMartialArt).toBeTruthy();
        });
    });
  });

  // Testing Exam Module
  describe('Exam Module', () => {
    it('getAllExams (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getAllExams{_id, title, examiner, participants}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getAllExams).toBeTruthy();
          expect(body.data.getAllExams[0].title).toBeTruthy();
          expect(body.data.getAllExams[0].examiner).toBeTruthy();
          expect(body.data.getAllExams[0].participants).toBeDefined();
        });
    });
    let examId: string;
    it('createExam (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createExam(input: {
            title: "E2E TEST-Prüfungen"
            description: "Lorem Ipsum"
            examDate: "2020-06-14"
            regEndDate: "2020-06-13"
            club: "5e1306132002aa4ff88620a1"
            examiner: "${user._id}"
            martialArt: "5e1323f45521bf49046ca85c"
            participants: ["${user._id}"]}){
          _id, title, examiner, martialArt, participants}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.createExam).toBeTruthy();
          expect(body.data.createExam._id).toBeTruthy();
          expect(body.data.createExam.title).toBeTruthy();
          expect(body.data.createExam.examiner).toBeTruthy();
          expect(body.data.createExam.participants).toBeDefined();
          examId = body.data.createExam._id;
        });
    });
    it('getExamById (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getExamById(id: "${examId}"){_id, title, examiner, participants}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getExamById).toBeTruthy();
          expect(body.data.getExamById.title).toBeTruthy();
          expect(body.data.getExamById.examiner).toBeTruthy();
          expect(body.data.getExamById.participants).toBeDefined();
        });
    });
    it('getPlannedExams (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getPlannedExams{_id, title, examiner, participants}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getPlannedExams).toBeTruthy();
          expect(body.data.getPlannedExams[0].title).toBeTruthy();
          expect(body.data.getPlannedExams[0].examiner).toBeTruthy();
          expect(body.data.getPlannedExams[0].participants).toBeDefined();
        });
    });
    it('deleteExam (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteExam(examId: "${examId}")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log('deleteExam: '+JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.deleteExam).toBeTruthy();
        });
    });
  });

  // Testing ExamResult Module
  describe('ExamResult Module', () => {
    let erId: string;
    it('createExamResult (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createExamResult(input: {
            user: "${user._id}"
            exam: "5e187d278bff622b545f64dd"
            examiner: {
              _id: "${user._id}",firstName: "Karl",lastName: "Marx"}
            martialArt: {
              _id: "5e1323f45521bf49046ca85c",name: "Battojutsu"
              styleName:"Shobukan Inyo-Ryu"}
            rank: "5. Kyu",date: "2020-06-14",passed: true})
        {_id, user, exam, examiner{firstName}
          rank,passed,martialArt{name}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.createExamResult).toBeTruthy();
          expect(body.data.createExamResult._id).toBeTruthy();
          expect(body.data.createExamResult.examiner).toBeTruthy();
          expect(body.data.createExamResult.martialArt).toBeTruthy();
          erId = body.data.createExamResult._id;
        });
    });
    it('createExamResult (Mutation | Duplicate Test)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createExamResult(input: {
            user: "${user._id}"
            exam: "5e187d278bff622b545f64dd"
            examiner: {
              _id: "${user._id}",firstName: "Karl",lastName: "Marx"}
            martialArt: {
              _id: "5e1323f45521bf49046ca85c",name: "Battojutsu"
              styleName:"Shobukan Inyo-Ryu"}
            rank: "5. Kyu",date: "2020-06-14",passed: true})
        {_id, user, exam, examiner{firstName}
          rank,passed,martialArt{name}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).not.toBeTruthy();
          expect(body.errors).toBeTruthy();
        });
    });
    it('getExamResultById (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getExamResultById(id: "${erId}")
            {_id, user, exam, martialArt{name},rank}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getExamResultById).toBeTruthy();
          expect(body.data.getExamResultById.user).toBeTruthy();
          expect(body.data.getExamResultById.martialArt).toBeTruthy();
        });
    });
    it('getAllExamResults (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getAllExamResults
            {_id, user, exam, martialArt{name},rank}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getAllExamResults).toBeTruthy();
          expect(body.data.getAllExamResults[0].user).toBeTruthy();
          expect(body.data.getAllExamResults[0].martialArt).toBeTruthy();
        });
    });
    it('deleteRelatedExamResults (Mutation)', async () => {
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteRelatedExamResults}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.deleteRelatedExamResults).toBeTruthy();
        });
    });
  });

  // Testing Umbrella Association Module
  describe('UmbrellaAssoc Module', () => {
    let uaId: string;
    it('createUA (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createUA(
            input:{
              name:"E2E Test Umbrella e.V.",street:"Teststreet 1",
              zip:"12345",city:"Testcity",
              registrationId:"E2E-12345",country:"Germany",
              martialArts:["5e1323f45521bf49046ca85c"],admins:["${user._id}"],
              clubs:["5e1306132002aa4ff88620a1"],singleMembers:["${user._id}"]
            }){_id, name, martialArts{_id},admins{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.createUA).toBeTruthy();
          expect(body.data.createUA.name).toBeTruthy();
          expect(body.data.createUA.martialArts).toBeTruthy();
          expect(body.data.createUA.admins).toBeTruthy();
          uaId = body.data.createUA._id;
        });
    });
    it('createUA (Mutation | Duplicate Test)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createUA(
            input:{
              name:"E2E Test Umbrella e.V.",street:"Teststreet 1",
              zip:"12345",city:"Testcity",
              registrationId:"E2E-12345",country:"Germany",
              martialArts:["5e1323f45521bf49046ca85c"],admins:["${user._id}"],
              clubs:["5e1306132002aa4ff88620a1"],singleMembers:["${user._id}"]
            }){_id, name, martialArts{_id},admins{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).not.toBeTruthy();
          expect(body.errors).toBeTruthy();
          expect(body.errors[0].message).toBe('An umbrella association with this name already exists!');
        });
    });
    it('updateUA (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{updateUA(
            input:{
              name:"E2E Edited Umbrella e.V.",street:"Teststreet 12",
              zip:"12346",city:"Testcity",
            }, id: "${uaId}"){_id, name, martialArts{_id},admins{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.updateUA).toBeTruthy();
          expect(body.data.updateUA.name).toBe('E2E Edited Umbrella e.V.');
        });

    });
    it('getAllUAs (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getAllUAs{_id, name, martialArts{_id},admins{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getAllUAs).toBeTruthy();
          expect(body.data.getAllUAs[0].name).toBeTruthy();
          expect(body.data.getAllUAs[0].martialArts).toBeTruthy();
          expect(body.data.getAllUAs[0].admins).toBeTruthy();
        });
    });
    it('getUAById (Query)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `{getUAById(id: "${uaId}"){_id, name, martialArts{_id},admins{_id}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.getUAById).toBeTruthy();
          expect(body.data.getUAById.name).toBeTruthy();
          expect(body.data.getUAById.martialArts).toBeTruthy();
          expect(body.data.getUAById.admins).toBeTruthy();
        });
    });
    it('addUaAdmin (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addUaAdmin(uaId: "${uaId}", userId: "5e1c9385ac96ef12044e259b")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.addUaAdmin).toBeTruthy();
        });
    });
    it('deleteUA (Mutation)', async () => { 
      return await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteUA(uaId: "${uaId}")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.deleteUA).toBeTruthy();
        });
    });
  });
});
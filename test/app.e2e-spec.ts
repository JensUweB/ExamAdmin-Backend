import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let token: string;
  let user;
  
  // Testing Auth Module
  describe('Auth Module', () => {
    it('login', () => {
      return request(app.getHttpServer())
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
    it('login (wrong credentials)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          variables: {},
          query: `{login(email: "karl.marx@localhost", password: "admin")
          {token, tokenExpireDate, user{_id, firstName, lastName}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.errors).toBeTruthy();
        });
    });
  });

  //Testing User Module
  describe('User Module', () => {
    it('getUser (Query)', () => {
      return request(app.getHttpServer())
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
    it('getUser (UnAuthorized Query)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token + 'invalid-token-test')
        .send({
          operationName: null,
          variables: {},
          query: `{getUser{_id, firstName, lastName, email}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.errors).toBeTruthy();
        });
    });
    it('addUserToClub (Mutation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addUserToClub(clubId: "5e1306132002aa4ff88620a1")
          {_id, firstName}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.addUserToClub).toBeTruthy();
          expect(body.data.addUserToClub._id).toBeTruthy();
          expect(body.data.addUserToClub.firstName).toBeTruthy();
        });
    });
    it('addMartialArtRankToUser (Mutation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{addMartialArtRankToUser(rankId: "5e1323f45521bf49046ca862")
          {firstName}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(JSON.stringify(body));
          expect(body.data).toBeTruthy();
          expect(body.data.addMartialArtRankToUser).toBeTruthy();
        });
    });
    /* it('deleteUser (Mutation)', () => {
      return request(app.getHttpServer())
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
    it('createClub (Mutation)', () => {
      return request(app.getHttpServer())
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
        });
    });
    it('getAllClubs (Query)', () => {
      return request(app.getHttpServer())
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
  });

  // Testing the forgot password function
  describe('Forgot Password', () => {
    it('forgotPassword (Mutation)', () => {
      return request(app.getHttpServer())
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
    // ERROR: connect ECONNREFUSED 127.0.0.1:80
    /* it('auth/forgot-password/ (GET)', () => {
      return request(app.getHttpServer())
        .get('auth/forgot-password')
        .expect(HttpStatus.OK);
    }); */
  });

  // Testing MartialArts Module
  describe('MartialArts Module', () => {
    it('getAllMartialArts (Query)', () => {
      return request(app.getHttpServer())
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
    it('getMartialArtById (Query)', () => {
      return request(app.getHttpServer())
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
    it('getMartialArtByRank (Query)', () => {
      return request(app.getHttpServer())
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
    it('getRank (Query)', () => {
      return request(app.getHttpServer())
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
    it('createMartialArt (Mutation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{createMartialArt(input:{
            name:"E2Test",styleName:"E2ETest",
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
    it('deleteMartialArt (Mutation)', () => {
      return request(app.getHttpServer())
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
          expect(body.data.deleteMartialArt).toEqual('Success');
        });
    });
  });

  // Testing Exam Module
  describe('Exam Module', () => {
    it('getAllExams (Query)', () => {
      return request(app.getHttpServer())
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
    it('createExam (Mutation)', () => {
      return request(app.getHttpServer())
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
    it('getExamById (Query)', () => {
      return request(app.getHttpServer())
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
    it('getPlannedExams (Query)', () => {
      return request(app.getHttpServer())
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
    it('deleteExam (Mutation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteExam(examId: "${examId}")}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.deleteExam).toBeTruthy();
          expect(body.data.deleteExam).toEqual('Success');
        });
    });
  });

  // Testing ExamResult Module
  describe('ExamResult Module', () => {
    it('getAllExamResults (Query)', () => {
      return request(app.getHttpServer())
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
    let erId: string;
    it('createExamResult (Mutation)', () => {
      return request(app.getHttpServer())
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
            rank: "5. Kyu",date: "2020-06-14",reportUri: "",passed: true})
        {_id, user, exam, examiner{firstName}
          rank,passed,martialArt{name}}}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.createExamResult).toBeTruthy();
          expect(body.data.createExamResult._id).toBeTruthy();
          expect(body.data.createExamResult.examiner).toBeTruthy();
          expect(body.data.createExamResult.martialArt).toBeTruthy();
          erId = body.data.createExamResult._id;
        });
    });
    it('getExamResultById (Query)', () => {
      return request(app.getHttpServer())
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
    it('deleteRelatedExamResults (Mutation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', 'Bearer ' + token)
        .send({
          operationName: null,
          variables: {},
          query: `mutation{deleteRelatedExamResults}`,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeTruthy();
          expect(body.data.deleteRelatedExamResults).toBeTruthy();
        });
    });
  });
});
import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from './interfaces/user.interface';
import { UserInput } from "./input/user.input";

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}


    async create(userInput: UserInput): Promise<User> {
        const createdUser = new this.userModel(userInput);
        return await createdUser.save();
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = this.userModel.findOne({email: email});

        if(user) return user;
        else return null;
    }

    async findById(id: string): Promise<User | undefined> {
        return this.userModel.find(user => user.id === id);
    }

    async update(user: Model<User>) {
        return await user.save();
    }

    /* async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    } */
}
import mongoose from "mongoose";
import model, { BlockDto as Dto } from "./block.model";

class BlockService {
  async findAll(): Promise<Array<Dto>> {
    const items = await model.find();
    return items;
  }

  async find(id: mongoose.Types.ObjectId): Promise<Dto> {
    const item = await model.findById(id);
    return item;
  }

  async create(data: Dto): Promise<Dto> {
    const item = await model.create(data);
    return item;
  }

  async update(id: mongoose.Types.ObjectId, data: Dto): Promise<Dto> {
    const item = await model.findByIdAndUpdate(id, data, {
      new: true,
    });
    return item;
  }

  async delete(id: mongoose.Types.ObjectId): Promise<Dto> {
    const item = await model.findByIdAndRemove(id);
    return item;
  }

  async deleteAll(): Promise<any> {
    const res = await model.deleteMany({});
    return res;
  }
}

export default new BlockService();

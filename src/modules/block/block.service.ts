import mongoose from "mongoose";
import model, { BlockDto as Dto } from "./block.model";

class BlockService {
  /**
   * TODO: Refactor
   */
  private setWhere(timestampStart?: number, timestampEnd?: number) {
    const where: any = {};
    if (timestampStart) {
      where.timestamp = {
        ...where.timestamp,
        $gte: timestampStart,
      };
    }
    if (timestampEnd) {
      where.timestamp = {
        ...where.timestamp,
        $lt: timestampEnd,
      };
    }
    return where;
  }

  async findAll(
    timestampStart?: number,
    timestampEnd?: number
  ): Promise<Array<Dto>> {
    const where = this.setWhere(timestampStart, timestampEnd);
    const items = await model.find(where, undefined, {
      sort: {
        timestamp: 1,
      },
    });
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

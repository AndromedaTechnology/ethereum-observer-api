import helper, { IDaySummary, ISummaries } from "./helpers/summary.helper";

class SummaryService {
  async findAll(): Promise<ISummaries> {
    return helper.getSummary();
  }
  async find(dayTimestampStartMs: number): Promise<IDaySummary> {
    // Get End Date
    const dayDateEnd = new Date(dayTimestampStartMs);
    dayDateEnd.setHours(23);
    dayDateEnd.setMinutes(59);
    dayDateEnd.setSeconds(59);

    return await helper.getSummary(dayTimestampStartMs, dayDateEnd.getTime());
  }
}

export default new SummaryService();

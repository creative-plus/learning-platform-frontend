import { Project } from "../Project";
import { User } from "./User";

export interface Trainee extends User {
  country?: string;
  birthDate?: Date;
  projects?: Project[];
}

export interface TraineeRequest extends Trainee {
  projectIds: number[]
}
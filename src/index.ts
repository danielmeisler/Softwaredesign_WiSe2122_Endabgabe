import * as readline from "readline";
import Console from "./classes/console";

export class Main {

  public consoleLine: readline.ReadLine;

  constructor() {
    this.consoleLine = readline.createInterface({input: process.stdin, output: process.stdout})
  }

  public showProgramStatus(): void {
    Console.printLine("test");
  }
}

let main: Main = new Main();
main.showProgramStatus();
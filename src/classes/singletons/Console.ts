import readline from "readline";
import prompts from "prompts";

class Console {
  
  private static instance: Console = new Console();

  public consoleLine: readline.ReadLine = readline.createInterface({input: process.stdin, output: process.stdout})

  constructor() {
    if (Console.instance) {
      throw new Error("Instead of using new Console(), please use Console.getInstance() for Singleton!");
    } else {
      Console.instance = this;
    }
  }

  public static getInstance(): Console {
    return Console.instance;
  }

  public printLine(line: string): void {
    this.consoleLine.write(line);
    this.consoleLine.write("\n");
  }

}

export default Console.getInstance();
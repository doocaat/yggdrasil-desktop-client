import { provide } from 'inversify-binding-decorators';
import * as childProcess from 'child_process';
import * as sudo from 'sudo-prompt';

@provide(CmdService)
export class CmdService {
  public async runCommand(
    command: string,
    parseJsonOut: boolean = false
  ): Promise<{ process: childProcess.ChildProcess; out: any }> {
    return new Promise((resolve, reject) => {
      const process = childProcess.exec(command, (err, stdout, stderr) => {
        if (err !== null) {
          console.error('command run error:', command, stderr);
          return reject(err);
        }

        let out = stdout;

        if (parseJsonOut) {
          out = JSON.parse(stdout);
        }

        resolve({ process, out });
      });
    });
  }

  runSudoCommand(command: string, options: any): Promise<any> {
      return new Promise((resole, reject) => {
        sudo.exec(command, options,
            (errors, stdout, stderr) => {
              if (errors) {
                reject(errors);
              }

              resole(stdout);
            }
          );
      });
  }
}

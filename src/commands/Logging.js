import { command, option } from 'cli-core'
import _ from 'lodash'
import os from 'os'
import { config } from '../utils'
import { listRunning } from '../ProcessMonitor'

import Table from 'cli-table'
const getTable = labels => new Table({
    chars: {
        'top': '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        'bottom': '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        'left': '',
        'left-mid': '',
        'mid': '',
        'mid-mid': '',
        'right': '',
        'right-mid': '',
        'middle': ''
    },

    head: labels
})

const list = command("list|ls", "list all locations",
    () => {
        const table = getTable(["\x1b[1mName", "Alias", "Processes", "Root\x1b[0m"])

        const processes = listRunning()

        const data = _.map(config.locations, ({name, alias, root}) => [
            config.using == name ? `\x1b[32m[\x1b[0m${name}\x1b[32m]\x1b[0m` : name,
            alias || '',
            _.size(_.filter(processes, p => name == p.name)),
            root.replace(os.homedir(), '~')
        ])

        table.push(...data)
        return table.toString()
    },

    command("running", "List all running processes",
        () => {
            const table = getTable(["\x1b[1mLocation", "Cmd", "Watcher PID", "Process PID", "Logs", "State", "Attempt", "Max\x1b[0m"])

            const data = _.map(listRunning(), ({name, cmd, pid,childPid, logFile, failing, onAttempt, maxAttempts, didExit}) => [
                name.split(".")[0],
                cmd,
                pid,
                childPid,
                logFile,
                !didExit && onAttempt > 1 ? '\x1b[31mFailing\x1b[0m' : '\x1b[32mRunning\x1b[0m',
                onAttempt,
                maxAttempts
            ])

            table.push(...data)
            return `${table.toString()}${!data.length ? "\nNo running processes" : ""}`
        }
    )
)

const log = command("logs", "display the logs of a location",
    () => {

    },

    command("clear", "clear logs",
        () => {

        },

        command(":name", "the name of the location",
            () => {

            },

            command("all", "clear all commands at this location",
                () => {

                }
            ),

            command(":command", "the name of the command",
                () => {

                }
            )
        )
    ),

    command(":name", "the name of the location",
        () => {

        },

        command(":command", "the name of the command",
            () => {

            }
        )
    )
)

export { list, log }
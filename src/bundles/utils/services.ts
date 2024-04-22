import {PartialTaskItemObject, TaskItemObject, TaskListObject} from '../shared/objects.ts'


export const TaskService = {
    urlBase: 'https://taskmanagedjango.onrender.com',

    getPaginatedList: async function(page: number) {
        const response: Response = await fetch(`${this.urlBase}/task-list?page=${page}`)
        const data: TaskListObject = await response.json()

        return data
    },

    deleteTaskFromId: async function(id: string) {
        const response: Response = await fetch(`${this.urlBase}/delete-many-tasks`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ids: [id]})
        })

        if (response.status != 204) {
            throw Error(`Failed to delete task list. Status=${response.status}`)
        }
    },
    finishTaskFromId: async function(id: string) {
        const response: Response = await fetch(`${this.urlBase}/update-task/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                done: true
            })
        })

        const data: TaskItemObject = await response.json()

        return data
    },
    updateTaskContent: async function(item: PartialTaskItemObject) {
        const body: PartialTaskItemObject = {}

        console.log(item)

        if (!item.id) {
            // noinspection ExceptionCaughtLocallyJS
            throw Error(`Failed to update task ${item.id}`)
        }

        if (item.name) {
            body.name = item.name
        }
        if (item.created_at) {
            body.created_at = item.created_at
        }
        if (item.finished_at) {
            body.finished_at = item.finished_at
        }
        if (item.done) {
            body.done = item.done
        }
        if (item.description) {
            body.description = item.description
        }

        const response: Response = await fetch(`${this.urlBase}/update-task/${item.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        
        const data: TaskItemObject = await response.json()

        return data
    },
    createTask: async function(content: PartialTaskItemObject) {
        const current_date: Date = new Date();
        const date: string = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-${current_date.getDay()}`

        const body: PartialTaskItemObject = {
            ...content,
            created_at: date
        }

        const response: Response = await fetch(`${this.urlBase}/create-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        
        const data: TaskItemObject = await response.json()
        
        return data
    },
    getTaskFromId: async function (id: string | undefined) {
        const response = await fetch(`${this.urlBase}/task/${id}`)
        const data: TaskItemObject = await response.json()

        return data
    }
}
export interface TaskListObject {
    count: number
    next: string | null
    previous: string | null
    results: TaskItemObject[]
}

export interface TaskItemObject {
    id: string
    name: string
    description: string
    finished_at: string
    created_at: string
    done: boolean
}

export interface PartialTaskItemObject {
    id?: string
    name?: string
    description?: string
    created_at?: string
    finished_at?: string
    done?: boolean
}

export interface TaskSaveObject {
    name?: string
    description?: string | undefined
    finished_at?: string
    done?: boolean
}

export interface DateRefObject {
    name: string
    value: string
}
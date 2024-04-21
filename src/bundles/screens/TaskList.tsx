import {BigSpinner, SmallSpinner} from '../components/Spinner.tsx'
import {useEffect, useState} from 'react'

import {TaskItemObject, TaskListObject} from '../shared/objects.ts'

import {TaskService} from '../utils/services.ts'

import TasKListItem from '../components/TaskListItem.tsx'


export default function TaskList(): JSX.Element {
    const [initialize, setInitialize] = useState<boolean>(false)
    const [list, setList] = useState<TaskListObject>({
        count: 0,
        next: null,
        previous: null,
        results: []
    })
    const [page, setPage] = useState<number>(1)

    const [awaitNext, setAwaitNext] = useState<boolean>(false)
    const [awaitPrevious, setAwaitPrevious] = useState<boolean>(false)
    const [awaitTasks, setAwaitTasks] = useState<boolean>(false)

    const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false)
    const [isLoadingPrevious, setIsLoadingPrevious] = useState<boolean>(false)

    useEffect((): void => {
        if (initialize) {
            const handleTaskServiceRequest = async (): Promise<void> => {
                const tasks: TaskListObject = await TaskService.getPaginatedList(page)
                setList(tasks)
            }
            const fetchTask = async (): Promise<void> => {
                if (isLoadingPrevious) {
                    setAwaitPrevious(true)
                    setAwaitTasks(true)
                    setIsLoadingPrevious(false)

                    await handleTaskServiceRequest()

                    setAwaitPrevious(false)
                    setAwaitTasks(false)
                }
                else if (isLoadingNext) {
                    setAwaitNext(true)
                    setAwaitTasks(true)
                    setIsLoadingNext(false)

                    await handleTaskServiceRequest()

                    setAwaitNext(false)
                    setAwaitTasks(false)
                }
                else {
                    setAwaitTasks(true)
                    await handleTaskServiceRequest()
                    setAwaitTasks(false)
                }
            }
            fetchTask().then()
        }
        else {
            setInitialize(true)
        }
    }, [initialize, isLoadingNext, isLoadingPrevious, page]);

    function handlePreviousPage() {
        if (list.previous !== null) {
            setIsLoadingPrevious(true)
            setPage(page - 1)
        }
    }
    function handleNextPage() {
        if (list.next !== null) {
            setIsLoadingNext(true)
            setPage(page + 1)
        }
    }

    return (
        <main>
            <div>
                <h1>Lista de Tarefas</h1>
                <ul>
                    {awaitTasks
                        ? (<BigSpinner/>)
                        : list.results.map((item: TaskItemObject) => (
                            <TasKListItem data={item} key={item.id}/>
                        ))}
                </ul>
                <div>
                    <button onMouseUp={handlePreviousPage}>
                        {!awaitPrevious ? 'Previous' : (<SmallSpinner/>)}
                    </button>
                    <button onMouseUp={handleNextPage}>
                        {!awaitNext ? 'Next' : (<SmallSpinner/>)}
                    </button>
                </div>
            </div>
        </main>
    )
}

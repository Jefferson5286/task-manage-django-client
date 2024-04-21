import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

import {TaskListItemProps} from '../shared/props.ts'
import {ProcessDate} from '../utils/tools.ts'

import {TaskService} from '../utils/services.ts'
import {SmallSpinner} from "./Spinner.tsx";


export default function TasKListItem(props: TaskListItemProps): JSX.Element {
    const finished_at: string = props.data.finished_at == null ?
        'Não definido' : new ProcessDate(props.data.finished_at).decode()

    const created_at: string = new ProcessDate(props.data.created_at).decode()

    const description: string = props.data.description.length < 55 ?
        props.data.description : props.data.description.slice(0, 55) + '[...]'

    const navigate = useNavigate()

    const [isFinished, setIsFinished] = useState<boolean>(props.data.done)
    const [isDeleted, setIsDeleted] = useState<boolean>(false)

    const [awaitDeletion, setAwaitDeletion] = useState<boolean>(false)
    const [awaitUpdate, setAwaitUpdate] = useState<boolean>(false)

    function handleRedirectToEditor() {
        navigate(`/editor/${props.data.id}`)
    }
    function handleRedirectToShow() {
        navigate(`/${props.data.id}`)
    }
    function handleDeleteTask () {
        setAwaitDeletion(true)

        TaskService.deleteTaskFromId(props.data.id).then(() => {
            setIsDeleted(true)
            setAwaitUpdate(false)
        })
    }
    function handleUpdateStatus(): void {
        if (!isFinished) {
            setAwaitUpdate(true)

            TaskService.finishTaskFromId(props.data.id).then(() => {
                setAwaitUpdate(false)
                setIsFinished(true)
            })
        }
    }

    const HandleNoFinishedTask = (): JSX.Element => {
        return !awaitUpdate ? (<>Terminar</>) : (<SmallSpinner/>)
    }

    return (<>
        {!isDeleted && (
            <li key={props.data.id}>
                <div>
                    <div/>
                </div>
                <div onMouseUp={handleRedirectToShow}>
                    <div>{props.data.name}</div>
                    <div>{description}</div>
                    <div>{created_at} | {finished_at}</div>
                </div>
                <div>
                    <button onMouseUp={handleRedirectToEditor}>Editar</button>
                    <div>
                        <button onMouseUp={handleUpdateStatus}>{
                            !isFinished ? (<HandleNoFinishedTask/>) : 'Concluída'
                        }</button>
                        <button onMouseUp={handleDeleteTask}>{
                            awaitDeletion ? <SmallSpinner/> : 'Excluir'
                        }</button>
                    </div>
                </div>
            </li>
        )}
    </>)
}

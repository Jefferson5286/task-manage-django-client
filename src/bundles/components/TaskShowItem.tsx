import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {SmallSpinner} from './Spinner.tsx'

import {TaskShowItemProps} from '../shared/props.ts'
import {ProcessDate} from '../utils/tools.ts'

import {TaskService} from '../utils/services.ts'


export function TaskShowItem(props: TaskShowItemProps): JSX.Element {
    const finished_at: string = props.data.finished_at == null ?
        'Não definido' : new ProcessDate(props.data.finished_at).decode()

    const created_at: string = new ProcessDate(props.data.created_at).decode()

    const navigate = useNavigate()

    const [awaitUpdate, setAwaitUpdate] = useState<boolean>(false)
    const [awaitDeletion, setAwaitDeletion] = useState<boolean>(false)

    const [isFinished, setIsFinished] = useState<boolean>(props.data.done)

    function handleEditTaskButton() {
        navigate(`/editor/${props.data.id}`)
    }
    function handleDeleteTaskButton() {
        setAwaitDeletion(true)
        TaskService.deleteTaskFromId(props.data.id).then(() => {
            navigate('/')
        })
    }
    function handleFinishTaskButton() {
        if (!isFinished) {
            setAwaitUpdate(true)
            TaskService.finishTaskFromId(props.data.id).then(() => {
                setAwaitUpdate(false)
                setIsFinished(true)
            })
        }
    }

    const HandleNoFinishedTask = (): JSX.Element => {
        return !awaitUpdate ? (<>Concluir Tarefa</>) : (<SmallSpinner/>)
    }


    return (<div>
        <h2>{props.data.name}</h2>
        <div>id: {props.data.id}</div>
        <section>
            <div>
                <div>{created_at}</div>
                <div>{finished_at}</div>
            </div>
            <div className={isFinished ? 'TaskStatusWidgetFinished' : 'TaskStatusWidgetNoFinished'}/>
        </section>
        <section>
            <h3>Descrição</h3>
            <p>{props.data.description}</p>
        </section>
        <section>
            <button onMouseUp={handleDeleteTaskButton}>
                {!awaitDeletion ? 'Excluir' : (<SmallSpinner/>)}
            </button>
            <button onMouseUp={handleEditTaskButton}>Editar</button>
            <button
                onMouseUp={handleFinishTaskButton}
                className={isFinished ? 'TaskFinishedButtonStyle' : 'TaskNoFinishedButtonStyle'}>

                {!isFinished ? (<HandleNoFinishedTask/>) : 'Concluída'}
            </button>
        </section>
    </div>)
}

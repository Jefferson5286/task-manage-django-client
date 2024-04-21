import {Routes, Route, BrowserRouter, Link} from 'react-router-dom'

import TaskList from './bundles/screens/TaskList.tsx'
import TaskEditor from './bundles/screens/TaskEditor.tsx'
import TaskShow from "./bundles/screens/TaskShow.tsx";


export default function App(): JSX.Element {
    return (
        <BrowserRouter>
            <nav>
                <div>TaskManage Django</div>
                <div>
                    <Link to='/'>Tarefas</Link>
                    <Link to='/editor'>Criar tarefa</Link>
                </div>
            </nav>
            <Routes>
                <Route
                    path='/'
                    element={<TaskList/>}
                />
                <Route
                    path='/editor/:id?'
                    element={<TaskEditor/>}
                />
                <Route
                    path='/:id?'
                    element={<TaskShow/>}
                />
            </Routes>
        </BrowserRouter>
    )
}
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useResetAnswers } from '../api-hooks/useResetAnswers'
import { APP_ROUTES } from '../domain/routes'
import { useAnswersStore } from '../state'

// TASK 4:
// - Implement the table from this mockup (public/table_view_mockup.png).
// - Display answers from store in table.
// - Each row of the table body should have the name of the answer
// and its value.
// - Add the edit and delete buttons on top of the table.

// TASK 5:
// - Redirect to Form view on edit button click.

// TASK 6:
// - Invoke useResetAnswers hook on delete button click.
// - See useResetAnswers hook for more guidelines.

function createData(question: string, answer: string) {
    return { question, answer }
}

export function TableView() {
    const answers = useAnswersStore(state => state.getAnswers())
    const navigate = useNavigate()
    const resetAnswersMutation = useResetAnswers()

    const getInterests = () =>
        answers.interests
            .map(interest => {
                const entry = Object.entries(interest)[0]
                return {
                    label: entry[1].label,
                    checked: entry[1].isChecked,
                }
            })
            .filter(interest => interest.checked)
            .map(checkedInterest => checkedInterest.label)
            .join(', ')

    const rows = [
        createData('Name', answers.name),
        createData('Age', answers.age),
        createData('Email', answers.mail),
        createData('Interests', getInterests()),
    ]
    return (
        <div id="table-view">
            <TableContainer
                component={Paper}
                style={{
                    position: 'relative',
                    overflow: 'visible',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: -40,
                        right: 0,
                        display: 'flex',
                        gap: 16,
                    }}
                >
                    <EditIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            navigate(APP_ROUTES.FORM)
                        }}
                    />
                    <DeleteIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            resetAnswersMutation.mutate()
                        }}
                    />
                </div>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Questions</strong>
                            </TableCell>
                            <TableCell align="right">
                                <strong>Answers</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow
                                key={row.question}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.question}
                                </TableCell>
                                <TableCell align="right">
                                    {row.answer}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

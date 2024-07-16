import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
// import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useUpdateAnswers } from '../api-hooks/useUpdateAnswers'
import { CheckboxGroup } from '../components'
import { CustomCheckboxProps } from '../components/CheckboxGroup'
import { useAnswersStore } from '../state'

import { validationSchema } from './Form.config'

export const FormView = () => {
    const answers = useAnswersStore(state => state.getAnswers())
    const [interests, setInterests] = useState(answers.interests)

    useEffect(() => {
        setInterests(answers.interests)
    }, [answers.interests])

    const onInterestChangeHandler = (options: CustomCheckboxProps[]) => {
        const interestsMap = options.map(option => ({
            [option.id]: {
                isChecked: option.checked || false,
                label: option.label || '',
            },
        }))
        setInterests(interestsMap)
    }

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
    })

    const updateAnswersMutation = useUpdateAnswers()

    const onSubmit = handleSubmit(formData => {
        updateAnswersMutation.mutate({
            name: formData.name,
            mail: formData.mail,
            age: formData.age,
            interests: [],
        })
    })

    const getAnswerInterestsMap = () =>
        interests.map(interest => {
            const entry = Object.entries(interest)[0]
            return {
                id: entry[0],
                label: entry[1].label,
                checked: entry[1].isChecked,
            }
        })

    return (
        <div id="form-view">
            <Box
                display="flex"
                gap={4}
                sx={{ flexDirection: 'column', width: '300px' }}
            >
                <Controller
                    name="name"
                    control={control}
                    defaultValue={answers.name}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Name"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.name?.message || ''}
                            error={Boolean(errors.name?.message)}
                        />
                    )}
                />
                <Controller
                    name="age"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Age"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.age?.message || ''}
                            error={Boolean(errors.age?.message)}
                        />
                    )}
                />
                <Controller
                    name="mail"
                    control={control}
                    defaultValue={answers.mail}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Email"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.mail?.message || ''}
                            error={Boolean(errors.mail?.message)}
                        />
                    )}
                />
                {/*
                    TASK 2:
                    - Integrate CheckboxGroup into the form, controlled
                    by react-hook-form.
                    - Ensure the form's initial state is properly
                    configured to kickstart the form's state cycle.
                    - Do NOT modify types of answers.interests or
                    CheckboxGroup's options. This could be detrimental
                    to your final assessment.
                */}
                <Controller
                    name="interests"
                    control={control}
                    defaultValue={getAnswerInterestsMap()}
                    render={({ field: { onChange } }) => (
                        <CheckboxGroup
                            id="interests"
                            error={!!errors.interests?.message}
                            helperText={errors.interests?.message || ''}
                            label="Interests"
                            options={getAnswerInterestsMap()}
                            onChange={e => {
                                onInterestChangeHandler(e)
                                return onChange(e)
                            }}
                        />
                    )}
                />
                <Button
                    variant="contained"
                    disabled={!isValid}
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            </Box>
        </div>
    )
}

export const addUserFields = [
    {
        label: 'Full name',
        type: 'text',
        id: 'fullName',
        autoComplete: ''
    },
    {
        label: 'Email Address',
        type: 'email',
        id: 'username',
        autoComplete: 'email'
    },
    {
        label: 'Password',
        type: 'password',
        id: 'password',
        autoComplete: ''
    },
    {
        label: 'Organization',
        type: 'select',
        id: 'stakeholderId',
        autoComplete: '',
        dataSource: 'stakeholders'
    }
]

export const editUserFields = [
    {
        label: 'Full name',
        type: 'text',
        id: 'fullName',
        autoComplete: ''
    },
    {
        label: 'Email Address',
        type: 'email',
        id: 'username',
        autoComplete: 'email'
    },
    {
        label: 'Organization',
        type: 'select',
        id: 'stakeholderId',
        autoComplete: '',
        dataSource: 'stakeholders'
    }
]
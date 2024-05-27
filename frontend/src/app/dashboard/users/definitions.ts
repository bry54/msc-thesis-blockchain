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
    },
    {
        label: 'Role',
        type: 'select',
        id: 'role',
        autoComplete: '',
        dataSource: 'roles'
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

export interface UserModel {
        "id": string,
        "fullName": string,
        "username": string,
        "password": string,
        "createdAt": string,
        "updatedDate": string,
        "deletedDate": string
    }

export interface BlockchainUserModel {
    "TxId": string,
    "Timestamp": {
        "seconds": number,
        "nanos": number
    },
    "Record": {
        "ID": string,
        "fullName": string,
        "username": string,
        "password": string,
        "createdAt": string,
        "updatedDate": string,
        "deletedDate": string
    }
    summary: any
}

export const userDescriptionLabels = [
    {key: 'id', value: 'Local ID'},
    {key: 'fullName', value: 'Full Name'},
    {key: 'username', value: 'Username'},
    {key: 'stakeholder', value: 'Organization'},
    {key: 'role', value: 'Role'},
    {key: 'empty', value: ''},
    {key: 'createdAt', value: 'Created At'},
    {key: 'updatedDate', value: 'Last Update'},
    {key: 'deletedDate', value: 'Deleted At'},
]
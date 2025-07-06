import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const addUser = async (user: {name: string, email: string}) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    })
    if(!res.ok) throw new Error("ereroero brother");
    return res.json();
}
const AddUser = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: addUser,
        // when new data added to api, old data is mark as stale so we should refetch api with new data
        // onSuccess does it exactly right under the key 'users'
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
        }
    })
    

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({name, email})
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
            />
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Adding...' : 'Add User'}
            </button>
            {mutation.isError && <p>Error adding user</p>}
            {mutation.isSuccess && <p>User added!</p>}
        </form>
    )
}
export default AddUser
import { useQuery } from "@tanstack/react-query"

const fetchUsers = async () => {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users') 
        if(!res.ok) throw new Error("errreriore Brother");
        return res.json();
    } catch (error) {
        console.log('Fetch Error', error);
        throw error;
    }
}

const Users = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 5 * 60 * 1000,
        retry: 3
    })

    if(isLoading) return <h1>Loading...</h1>
    if(isError) return <h1>Eroror brothererer {error.message}</h1>

    return (
        <div>
            <h2> Users List: </h2>
            <button onClick={() => refetch()}>refetch data</button>
            {isFetching && <p>refetching data</p>}
            <ul>
                {data.map((user : any) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>    
                ))}
            </ul>

        </div>
    )
}
export default Users
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const fetchUsers = async (page: number) => {
  const limit = 5
  const skip = (page - 1) * limit
  const res = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

const PaginatedUsers = () => {
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers(page),
    keepPreviousData: true,
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {(error as Error).message}</p>

  const totalPages = Math.ceil(data.total / data.limit)

  return (
    <div>
      <h2>Users (Page {page})</h2>
      {isFetching && <p style={{ color: 'orange' }}>Fetching new page...</p>}

      <ul>
        {data.users.map((user: any) => (
          <li key={user.id}>
            {user.firstName} {user.lastName} — {user.email}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  )
}

export default PaginatedUsers

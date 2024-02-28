'use client'
import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { Button, Switch } from '@mui/material'
import { toast } from 'sonner'

interface Column {
  id: String
  label: string
  minWidth?: number
  align?: 'center'
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'branchName', label: 'Branch Name' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'address', label: 'Address' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' }
]

const App = () => {
  const [branchs, setBranchs] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [reloadBranchs, setReloadBranchs] = useState(true)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const fetchBranchs = async () => {
    const response = await fetch('/api/branchs')
    const data = await response.json()
    setReloadBranchs(false)
    return data
  }

  useEffect(() => {
    if (reloadBranchs) {
      fetchBranchs().then((data) => {
        setBranchs(data.branchs)
      })
    }
  }, [reloadBranchs])

  const formatData = ({
    id,
    branchName,
    phoneNumber,
    address,
    province,
    district,
    postalCode,
    status
  }: any): any => {
    return {
      id,
      branchName,
      phoneNumber,
      address:
        address +
        ', District: ' +
        district +
        ', Province: ' +
        province +
        ', Postal Code: ' +
        postalCode,
      status
    }
  }

  const toggleStatus = async (id: number) => {
    try {
      const response = await fetch('/api/branchs/togglestatus', {
        cache: 'no-store',
        method: 'POST',
        body: JSON.stringify({ id })
      })
      if (response.status === 200) {
        const data = await response.json()
        switch (data.status) {
        case 200:
          toast.success('Branch status updated successfully')
          break
        case 404:
          toast.error('Branch not found')
          setReloadBranchs(true)
          break
        default:
          toast.error('Something wrong!!!')
          setReloadBranchs(true)
          break
        }
        return data.data
      }
      return null
    } catch (error) {
      console.log(error)
      toast.error('Something wrong!!!')
    }
  }

  const handleSwitch = async (id: number, newValue: boolean) => {
    try {
      const newBranches: any[] = [...branchs]
      newBranches[id] = { ...newBranches[id], status: newValue }
      setBranchs(newBranches as [])
      let isError = await toggleStatus(newBranches[id].id)
      if (!isError) {
        throw new Error('Something wrong!!!')
      }
    } catch (error) {
      console.log(error)
      setBranchs(branchs)
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!branchs && (
              <TableRow>
                <TableCell colSpan={6}>No data found</TableCell>
              </TableRow>
            )}
            {branchs.map((row, x) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={x}>
                  {columns.map((column, y) => {
                    let value: any
                    value = formatData(row)[column.id as keyof typeof row]
                    if (column.id === 'status') {
                      return (
                        <TableCell key={y}>
                          <Switch
                            checked={!!value}
                            onChange={() => {
                              handleSwitch(x, !value)
                            }}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </TableCell>
                      )
                    }
                    if (column.id === 'action') {
                      return (
                        <TableCell key={y}>
                          <Button variant='contained' color='primary'>
                            Edit
                          </Button>
                        </TableCell>
                      )
                    }
                    return <TableCell key={y}>{value}</TableCell>
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={branchs?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default App

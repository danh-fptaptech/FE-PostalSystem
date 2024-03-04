'use client'
import { Box, Button, Grid, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Employee } from '@/components/interfaces'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const [newsId, setNewsId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [slug, setSlug] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState(0)
  const [status, setStatus] = useState(0)
  const [employees, SetEmployees] = useState<Employee[]>([])
  const router = useRouter()

  const handleChange = (event: SelectChangeEvent) => {
    setEmployeeId(event.target.value as string)
  }

  // Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/employees')
      const data = await response.json()
      SetEmployees(data.data)
      console.log('employee:', data)
    }
    fetchData()
  }, [])

  const [loading, setLoading] = useState(!id)

  useEffect(() => {
    console.log('params.id:', id)
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/news/${id}`)
        console.log('response:', response)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log('data:', data)
        // Fill the form fields with the data
        setNewsId(data.data.id)
        setTitle(data.data.title)
        setContent(data.data.content)
        setEmployeeId(data.data.employeeId)
        setSlug(data.data.slug)
        setAuthor(data.data.author)
        setCategory(data.data.category)
        setStatus(data.data.status)
      } catch (error) {
        console.error('Fetch error:', error)
        toast.error('Failed to fetch news data')
      } finally {
        // Set loading to false after the data has been fetched or if an error occurred
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id]) // Depend on id to refetch data when id changes

  // In your render method
  if (loading) {
    return <div>Loading...</div>
  }


  // Update the handleSubmit function
  const handleSubmit = async () => {
    const news = {
      id: newsId,
      title,
      slug,
      content,
      author,
      employeeId,
      category: 0,
      status: 0
    }

    const res = await fetch(`/api/news-management/create-update/${newsId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(news)
    })

    if (res.ok) {
      toast.success('Edit news successfully')
      router.push('/app/news-management')
    } else {
      toast.error('Fail to edit news')
    }
  }

  return (
    <>
      <Box>
        <Paper elevation={1} sx={{ my: 3, p:1, borderRadius: '6px', boxSizing: 'border-box' }}>
          <h2>Update News</h2>
          <Box sx={{ m:2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ my:1 }}
                  required
                  id='title'
                  name='title'
                  fullWidth
                  placeholder='Enter title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <FormControl fullWidth sx={{ my:1 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    value={category}
                    id="demo-simple-select"
                    label="Category"
                    onChange={(e) => setCategory(e.target.value as number)}
                  >
                    {[0, 1].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value? 'Guide': 'Promotion'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ my:1 }}>
                  <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={employeeId}
                    label="Employee"
                    onChange={handleChange}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ my:1 }}>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    value={status}
                    id="demo-simple-select"
                    label="Status"
                    onChange={(e) => setStatus(e.target.value as number)}
                  >
                    {[0, 1].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value? 'Active': 'Deactive'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ my:1 }}
                  required
                  id='slug'
                  name='slug'
                  fullWidth
                  placeholder='Enter slug'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <TextField
                  sx={{ my:1 }}
                  required
                  id='author'
                  name='author'
                  fullWidth
                  placeholder='Enter author'
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <TextField
                  sx={{ my:1 }}
                  required
                  id='content'
                  name='content'
                  fullWidth
                  placeholder='Enter content'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button onClick={handleSubmit}>Update</Button>

          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default Page
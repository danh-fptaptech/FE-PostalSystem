'use client'
import { Box, Breadcrumbs, Grid, Stack, Typography } from '@mui/material'
import Link from '@mui/material/Link'
import React, { useEffect, useState } from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { format } from 'date-fns'
import { useParams } from 'next/navigation'
import { BlogItem } from '@/components/interfaces'

function Page({ params }: { params: { blogId: string } }) {
  const [blog, setBlog] = useState<BlogItem | null>(null)
  const id = params.blogId

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/news/${id}`)
      const data = await response.json()
      console.log(data)
      setBlog(data.data)
    }
    fetchData()
  }, [id])

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Home
    </Link>,
    <Typography key="2" color="inherit">
      {blog ? blog.title.toLocaleLowerCase() : 'Loading...'}
    </Typography>
  ]
  return (
    <Box>
      <Box sx={{ py:1, px:2 }}>
        <Stack>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Box>
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box sx={{ my: 2 }}>
            <Typography sx={{ fontWeight:'550', fontSize:'30px', ml:2 }}>{blog? blog.title:'Loading ...'}</Typography>
            <Box sx={{ ml:2 }}>
              <Typography>
                {blog && !isNaN(Date.parse(blog.createdAt))
                  ? format(new Date(blog.createdAt), 'dd/MM/yyyy')
                  : 'Loading...'}
              </Typography>
            </Box>
            <Box sx={{ ml:2, my:2 }}>
              <div dangerouslySetInnerHTML={{ __html: blog ? blog.content : 'Loading ...' }} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ my:2, pl:2 }}>
            <Typography sx={{ fontWeight:'550', fontSize:'25px' }}>Related News</Typography>
            <Box>
              <Typography>News 1</Typography>
              <Typography>News 2</Typography>
              <Typography>News 3</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Page
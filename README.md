# CIS 355 Midterm Project
For this project, I created a very basic forum that stores posts, and comments on those posts. 

## API
Posts can be created, retrived, modified, and deleted using:

`GET /api/posts/`: returns all posts
`GET /api/posts/:id`: return a post with the specified id

`POST /api/posts/`: create a post with a given title, author, and content

`PUT /api/posts/:id`: update the title, author, and content of the post with the specified id

`DELETE /api/posts/:id`: delete the post with the specified id

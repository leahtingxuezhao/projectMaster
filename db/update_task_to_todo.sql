update tasks
set status = 'to do'
where task_id = $1

returning *
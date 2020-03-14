 update tasks
set status = 'in progress'
where task_id = $1

returning *
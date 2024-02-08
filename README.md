# BizChina Internal Task Management Tool

This internal task management tool is a hub for BizChina club members to communicate and efficiently distribute tasks.
Some features include but are not limited to:
- Dashboard with the functionality to send and receive tasks from departments such as IT or HR
  - Tasks are synchronized for all users within a department with the use of Firebase's Cloud Firestore database
  - Users may only view tasks sent to their department
- Calendar displaying events and department tasks with their respective deadlines
  - Events can be added on the calendar, will be synchronized club-wide
  - Tasks are pulled from Firestore and users can only see tasks from their department
- Chat system to communicate with others
  - Users may create as many chats needed, and group chats have an unlimited size capacity
  - Users may send files within chats
- Bookmark functionality on dashboard, synchronized club-wide with the use of Firestore

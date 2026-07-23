import React from 'react'

const CreateSnippet = () => {
  return (
    <div>
      <form action="" className='flex flex-col space-y-4'>
        <input type="text" placeholder="Title" className='border rounded p-2 py-1 w-fit' />
        <textarea placeholder="write a code snippets..." className='border rounded p-2 py-1' />
        <button className='bg-blue-700 text-white px-6 py-2 rounded w-fit cursor-pointer'>Create</button>
      </form>
    </div>
  )
}

export default CreateSnippet

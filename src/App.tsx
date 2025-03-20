import { Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import { Navbar } from './components/Navbar'
import { CreatePostPages } from './pages/CreatePostPages'
import { PostPage } from './pages/PostPage'
import { CreateCommunityPages } from './pages/CreateCommunityPage'

function App() {

  return (
    <div className='min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20'>
      <Navbar/>
      <div className='container mx-auto px-4 py-4'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/create' element={<CreatePostPages/>}/>
            <Route path='/post/:id' element={<PostPage/>}/>
            <Route path='/community/create' element={<CreateCommunityPages/>}/>
          </Routes>
      </div>
    </div>
  )
}

export default App

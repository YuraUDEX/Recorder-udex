import Notification from '@/Components/Notification/page'
import { Recorder } from '@/Components/Recorder/page'

const Home: React.FC = () => {
  return (
    <main className="main__container">
      <div className="container">
        <Notification />
        <Recorder />
      </div>
    </main>
  )
}

export default Home

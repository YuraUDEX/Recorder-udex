import Notification from '@/Components/Notification/page'
import { Recorder } from '@/Components/Recorder/page'

export const Home: React.FC = () => {
  return (
    <main>
      <div className="container">
        <Notification />
        <Recorder />
      </div>
    </main>
  )
}

export default Home

import { useState } from 'react'
import { CameraControls } from './components/CameraControls'
import { CameraView } from './components/CameraView'
import { GestureStatus } from './components/GestureStatus'
import { PhotoPreview } from './components/PhotoPreview'

function App() {
  const [selectedTool, setSelectedTool] = useState<'camera' | 'filter' | 'frame'>(
    'camera',
  )

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 py-5 text-[#49516a] sm:px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-4">
        <div className="flex w-full max-w-4xl items-center justify-between px-1">
          <GestureStatus />
          <PhotoPreview />
        </div>

        <CameraView onCapture={() => undefined} />
        <CameraControls
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
        />
      </div>
    </main>
  )
}

export default App

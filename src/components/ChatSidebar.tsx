import { DialogTitle } from '@radix-ui/react-dialog'
import { useLiveQuery } from 'dexie-react-hooks'
import { Moon, Plus, Sun } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Button } from '~/components/ui/button'
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, Sidebar as SidebarPrimitive } from '~/components/ui/sidebar'
import { db } from '~/lib/dexie'
import { useTheme } from './ThemeProvider'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

export const ChatSidebar = () => {
  const [activeThread, setActiveThread] = useState('')
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [textInput, SetTextInput] = useState('')

  const { setTheme, theme } = useTheme()

  const location = useLocation()

  const handleToggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  const threads = useLiveQuery(() => db.getAllThreads(), [])

  const handleCreateThread = async () => {
    const threadId = await db.createThread(textInput)

    setDialogIsOpen(false)
    SetTextInput('')
  }

  useLayoutEffect(() => {
    const activeThreadId = location.pathname.split('/')[2]

    setActiveThread(activeThreadId)
  }, [location.pathname])

  return (
    <>
      <Dialog
        open={dialogIsOpen}
        onOpenChange={setDialogIsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Thread</DialogTitle>
          </DialogHeader>

          <div className='space-y-1'>
            <Label htmlFor='thread-title'>Thread title</Label>

            <Input
              id='thread-title'
              value={textInput}
              placeholder='Your new thread title'
              onChange={e => {
                SetTextInput(e.target.value)
              }}
            />
          </div>

          <DialogFooter>
            <Button
              variant='secondary'
              onClick={() => setDialogIsOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleCreateThread}>Create Thread</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SidebarPrimitive>
        <SidebarHeader>
          <Button
            className='w-full justify-start'
            variant='ghost'
            onClick={() => setDialogIsOpen(true)}
          >
            <Plus className='mr-2 h-4 w-4' />
            New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
              <SidebarMenu>
                {threads?.map(thread => (
                  <SidebarMenuItem key={thread.id}>
                    <Link to={`/thread/${thread.id}`}>
                      <SidebarMenuButton isActive={thread.id === activeThread}>{thread.title}</SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button
            onClick={handleToggleTheme}
            variant='ghost'
            className='w-full justify-start'
          >
            <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' /> Toggle Theme
          </Button>
        </SidebarFooter>
      </SidebarPrimitive>
    </>
  )
}

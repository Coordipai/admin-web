import { useState } from 'react'
import FormTextarea from '@components/FormTextArea'
import Header from '@components/Header'
import SideBar from '@components/SideBar'

import brandIcon from '@assets/brandIcon.png'

const FormInputTest = () => {
  const [value, setValue] = useState('')

  return (
    <div>
      <FormInput
        placeholder='Enter text'
        value={value}
        handleChange={(v) => setValue(v)}
        readOnly={false}
        type='text'
        hideCursor={false}
        disabled={false}
      />
      <div> value: {value}</div>
    </div>
  )
}

const FormTextAreaTest = () => {
  const [value, setValue] = useState('')

  return (
    <div>
      <FormTextarea
        placeholder='Enter text'
        value={value}
        handleChange={(v) => setValue(v)}
        readOnly={false}
        hideCursor={false}
        disabled={false}
      />
      <div> value: {value}</div>
    </div>
  )
}

const FormDropdownTest = () => {
  const memus = [
    { title: 'Option 1' },
    { title: 'Option 2' },
    { title: 'Option 3' }
  ]

  const [index, setIndex] = useState(0)
  const handleChange = (index) => {
    setIndex(index)
  }

  return (
    <div>
      <FormDropdown
        placeholder='Select an option'
        menus={memus}
        selectedMenu={index}
        handleChange={(i) => handleChange(i)}
      />
      <div> selected index: {index}</div>
      <div> selected value: {memus[index].title}</div>
    </div>
  )
}

const HeaderTest = () => {
  return (
    <div>
      <Header
        text='Header Title'
        isTab
        buttonsData={[
          {
            value: 'Button 1',
            isHighlighted: false,
            onClick: () => console.log('Button 1 clicked')
          },
          {
            value: 'Button 2',
            isHighlighted: true,
            onClick: () => console.log('Button 2 clicked')
          }
        ]}
      />
    </div>
  )
}

const SidebarTest = () => {
  const mockProject = {
    projectName: 'MockProjectX',
    iteration: {
      week: '3',
      period: '2025-05-01 ~ 2025-05-07'
    },
    issues: 42,
    categories: [
      {
        categoryName: 'Frontend',
        people: [
          {
            image: brandIcon,
            userName: 'Alice',
            githubId: 'alice-dev'
          },
          {
            image: brandIcon,
            userName: 'Bob',
            githubId: 'bob-dev'
          }
        ]
      },
      {
        categoryName: 'Backend',
        people: [
          {
            image: brandIcon,
            userName: 'Charlie',
            githubId: 'charlie-dev'
          }
        ]
      }
    ]
  }

  const mockUserInfo = {
    image: brandIcon,
    userName: 'TestUser',
    githubId: 'testuser123'
  }

  const logout = () => {
    console.log('Logout clicked')
  }

  return (
    <SideBar
      brandIcon={brandIcon}
      brandTitle='CoordiPai'
      project={mockProject}
      userInfo={mockUserInfo}
      logout={logout}
    />
  )
}

const ComponentTest = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SidebarTest />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
        <div> Component Test </div>
        <FormInputTest />
        <FormTextAreaTest />
        <FormDropdownTest />
        <HeaderTest />
      </div>
    </div>
  )
}

export default ComponentTest

import { useState } from 'react';
import FormInput from '@components/FormInput';
import FormTextarea from '@components/FormTextArea';
import FormDropdown from '../components/FormDropdown';
import { Form } from 'react-router-dom';

const FormInputTest = () => {
    const [value, setValue] = useState('');

    return (
        <div>
            <FormInput
                placeholder="Enter text"
                value={value}
                handleChange={(v) => setValue(v)}
                readOnly={false}
                type="text"
                hideCursor={false}
                disabled={false}
            />
            <div> value: {value}</div>
        </div>
    )
}

const FormTextAreaTest = () => {
    const [value, setValue] = useState('');

    return (
        <div>
            <FormTextarea
                placeholder="Enter text"
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
            { title: 'Option 3' },
    ];

    const [index, setIndex] = useState(0);
    const handleChange = (index) => {
        setIndex(index);
    }

    return (
        <div>
            <FormDropdown 
                placeholder="Select an option"
                menus={memus}
                selectedMenu={index}
                handleChange={(i) => handleChange(i)}
            />
            <div> selected index: {index}</div>
            <div> selected value: {memus[index].title}</div>
        </div>
    )
}


const ComponentTest = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div> Component Test </div>
            <FormInputTest />
            <FormTextAreaTest />
            <FormDropdownTest />
        </div>
    );
}

export default ComponentTest;
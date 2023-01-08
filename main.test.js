import {NewClientFromAccess, NewClient} from './main.js';

test('Test New Client', () =>{
    expect(NewClient('some ID', 'abcdefdf')).toBe(null);
})
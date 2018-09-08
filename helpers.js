import { describe, it } from './index'
export async function fdescribe(name,unfold){
    await describe(name,unfold,2);
}

export async function xdescribe(name,unfold){
    await describe(name,unfold,-2);
}

export async function fit (name,test){
    await it(name,test,2);
}

export async function xit (name,unfold){
    await it(name,test,-2);
}


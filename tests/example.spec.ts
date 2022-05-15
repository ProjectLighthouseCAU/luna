import { shallowMount } from '@vue/test-utils'
import DummyComp from '@/components/DummyLazy.vue'

describe('Some random component', () => {
  it('can be rendered', () => {
    const wrapper = shallowMount(DummyComp)
    expect(wrapper.html()).not.toBeFalsy()
  })
})

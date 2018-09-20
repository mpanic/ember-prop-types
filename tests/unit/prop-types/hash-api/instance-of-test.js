/**
 * Unit test for the PropTypes.instanceOf validator
 */
import EmberObject from '@ember/object'

import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {
  itValidatesTheProperty,
  spyOnValidateMethods
} from 'dummy/tests/helpers/validator'
import PropTypesMixin, {PropTypes} from 'ember-prop-types/mixins/prop-types'

class Classy {}

const requiredDef = {
  required: true,
  type: 'instanceOf',
  typeDef: Classy
}

const notRequiredDef = {
  required: false,
  type: 'instanceOf',
  typeDef: Classy
}

describe('Unit / validator / PropTypes.instanceOf', function () {
  const ctx = {propertyName: 'bar'}
  let sandbox, Foo

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    spyOnValidateMethods(sandbox)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when required', function () {
    beforeEach(function () {
      ctx.def = requiredDef
      Foo = EmberObject.extend(PropTypesMixin, {
        propTypes: {
          bar: PropTypes.instanceOf(Classy, {required: true})
        }
      })
    })

    describe('when initialized with Classy instance', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: new Classy()})
      })

      itValidatesTheProperty(ctx, false)
    })

    describe('when initialized with non-Classy instance', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: 1})
      })

      itValidatesTheProperty(ctx, false, 'Expected property bar to be an instance of Classy')
    })

    describe('when initialized without value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create()
      })

      itValidatesTheProperty(ctx, false, 'Missing required property bar')
    })
  })

  describe('when not required', function () {
    beforeEach(function () {
      ctx.def = notRequiredDef
      Foo = EmberObject.extend(PropTypesMixin, {
        propTypes: {
          bar: PropTypes.instanceOf(Classy, {required: false})
        }
      })
    })

    describe('when initialized with Classy instance', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: new Classy()})
      })

      itValidatesTheProperty(ctx, false)
    })

    describe('when initialized with non-Classy instance', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: 1})
      })

      itValidatesTheProperty(ctx, false, 'Expected property bar to be an instance of Classy')
    })

    describe('when initialized without value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create()
      })

      itValidatesTheProperty(ctx, false)
    })
  })

  describe('when updatable', function () {
    beforeEach(function () {
      console.warn.reset()

      ctx.def = {
        required: false,
        type: 'instanceOf',
        updatable: true
      }

      const Foo = EmberObject.extend(PropTypesMixin, {
        propTypes: {
          bar: PropTypes.instanceOf(Classy, {updatable: true})
        }
      })

      ctx.instance = Foo.create({bar: new Classy()})
    })

    describe('when updated', function () {
      beforeEach(function () {
        ctx.instance.set('bar', new Classy())
      })

      it('should not log warning', function () {
        expect(console.warn.called).to.equal(false)
      })
    })
  })

  describe('when not updatable', function () {
    beforeEach(function () {
      console.warn.reset()

      ctx.def = {
        required: false,
        type: 'instanceOf',
        updatable: false
      }

      const Foo = EmberObject.extend(PropTypesMixin, {
        propTypes: {
          bar: PropTypes.instanceOf(Classy, {updatable: false})
        }
      })

      ctx.instance = Foo.create({bar: new Classy()})
    })

    describe('when updated', function () {
      beforeEach(function () {
        ctx.instance.set('bar', new Classy())
      })

      it('should log warning', function () {
        expect(console.warn.called).to.equal(true)
        expect(console.warn).to.have.been.calledWith(
          `[${ctx.instance.toString()}]: bar should not be updated`
        )
      })
    })
  })
})

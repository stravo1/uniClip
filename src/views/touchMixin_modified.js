export default {
    data() {
        return {
            // config
            touchAxisArea: 20,
            // swipe
            touchSwipeElement: null,
            touchSwipeActive: false,
            touchSwipeDuration: 0,
            touchSwipeDurationLimit: 110,
            touchSwipeAxis: {},
            // tap
            touchTapElement: null,
            touchTapAxis: {},
        }
    },

    created() {
        this.touchSwipeReset()
        this.touchTapReset()
    },

    mounted() {
        if (!this.$isServer) {
            // swipe
            this.touchSwipeElement = this.$refs.touchSwipe
            if (this.touchSwipeElement) {
                this.touchSwipeElement.addEventListener(
                    'touchstart',
                    this.touchSwipeStart,
                    {
                        passive: false,
                    }
                )
                this.touchSwipeElement.addEventListener(
                    'touchend',
                    this.touchSwipeEnd,
                    {
                        passive: false,
                    }
                )
                this.touchSwipeElement.addEventListener(
                    'mousedown',
                    this.touchSwipeStart
                )
                this.touchSwipeElement.addEventListener(
                    'mouseout',
                    this.touchSwipeEnd
                )
                this.touchSwipeElement.addEventListener(
                    'mouseup',
                    this.touchSwipeEnd
                )
            }
            // tap
            this.touchTapElement = this.$refs.touchTap
            if (this.touchTapElement) {
                this.touchTapElement.addEventListener(
                    'touchstart',
                    this.touchTapStart,
                    {
                        passive: false,
                    }
                )
                this.touchTapElement.addEventListener(
                    'touchend',
                    this.touchTapEnd,
                    {
                        passive: false,
                    }
                )
            }
        }
    },

    beforeDestroy() {
        if (!this.$isServer) {
            // swipe
            if (this.touchSwipeElement) {
                this.touchSwipeElement.removeEventListener(
                    'touchstart',
                    this.touchSwipeStart
                )
                this.touchSwipeElement.removeEventListener(
                    'touchend',
                    this.touchSwipeEnd
                )
                this.touchSwipeElement.removeEventListener(
                    'mousedown',
                    this.touchSwipeStart
                )
                this.touchSwipeElement.removeEventListener(
                    'mouseout',
                    this.touchSwipeEnd
                )
                this.touchSwipeElement.removeEventListener(
                    'mouseup',
                    this.touchSwipeEnd
                )
            }
            // tap
            if (this.touchTapElement) {
                this.touchTapElement.removeEventListener(
                    'touchstart',
                    this.touchTapStart
                )
                this.touchTapElement.removeEventListener(
                    'touchend',
                    this.touchTapEnd
                )
            }
        }
    },

    methods: {
        touchSwipeStart(event) {
            //event.preventDefault()
            this.touchSwipeActive = true
            this.touchSwipeDuration = event.timeStamp
            this.touchSwipeAxis.x =
                event.screenX || event.changedTouches[0].screenX
            this.touchSwipeAxis.y =
                event.screenY || event.changedTouches[0].screenY
        },
        touchSwipeEnd(event) {
            if (this.touchSwipeActive) {
                if (
                    event.timeStamp - this.touchSwipeDuration >
                    this.touchSwipeDurationLimit
                ) {
                    let x =
                        this.touchSwipeAxis.x -
                        (event.screenX || event.changedTouches[0].screenX)
                    let y =
                        this.touchSwipeAxis.y -
                        (event.screenY || event.changedTouches[0].screenY)

                    if (Math.abs(x) > Math.abs(y)) {
                        if (Math.abs(x) > this.touchAxisArea) {
                            if (x > 0) {
                                this.touchSwipeToLeft()
                            } else {
                                this.touchSwipeToRight()
                            }
                        }
                    } else {
                        if (Math.abs(y) > this.touchAxisArea) {
                            if (y > 0) {
                                this.touchSwipeToUp()
                            } else {
                                this.touchSwipeToDown()
                            }
                        }
                    }
                }
                this.touchSwipeReset()
            }
        },
        touchTapStart(event) {
            event.preventDefault()
            this.touchTapAxis.x = event.changedTouches[0].screenX
            this.touchTapAxis.y = event.changedTouches[0].screenY
        },
        touchTapEnd(event) {
            let x = Math.abs(
                this.touchTapAxis.x - event.changedTouches[0].screenX
            )
            let y = Math.abs(
                this.touchTapAxis.y - event.changedTouches[0].screenY
            )
            if (x < this.touchAxisArea && y < this.touchAxisArea) {
                this.touchTap(event)
            }
            this.touchTapReset()
        },
        // reset
        touchSwipeReset() {
            this.touchSwipeActive = false
            this.touchSwipeDuration = 0
            this.touchSwipeAxis = {
                x: 0,
                y: 0,
            }
        },
        touchTapReset() {
            this.touchTapAxis = {
                x: 0,
                y: 0,
            }
        },
        // handler
        touchSwipeToUp() {},
        touchSwipeToLeft() {},
        touchSwipeToDown() {},
        touchSwipeToRight() {},
        touchTap() {},
    },
}

const {h, Component} = require('preact')
const smartypants = require('../../modules/smartypants')

class TrackInfo extends Component {
    getRenderText() {
        let {title, artists, album, loading} = this.props
        let titleText = smartypants(title || (loading ? '…' : 'No Title'))
        let artistsText = smartypants(artists && artists.length ? artists.join(', ') : (loading ? '…' : 'No Artists'))
        let albumText = smartypants(album || (loading ? '…' : 'No Album'))

        return [titleText, artistsText, albumText]
    }

    componentDidUpdate(prevProps, prevState) {
        let [titleText, artistsText, albumText] = this.getRenderText()
        let types = ['title', 'artists', 'album']
        let stateChange = {}

        types.forEach(type => {
            let element = this[`${type}Element`]
            stateChange[`${type}Overflow`] = element.scrollWidth > element.offsetWidth
        })

        if (types.some(type => prevState[`${type}Overflow`] != stateChange[`${type}Overflow`])) {
            this.setState(stateChange)
        }
    }

    render({loading, art}) {
        let texts = this.getRenderText()

        return h('section', {class: {'track-info': true, loading}},
            h('div', {class: 'drag'}),

            h('img', {
                class: 'art',
                src: 'img/blank.svg',
                style: {
                    backgroundImage: art ? `url('${art}')` : "url('img/blank.svg')"
                }
            }),
            
            h('ul', {},
                ['title', 'artists', 'album'].map((type, i) => h('li', {
                    class: {
                        [type]: true,
                        disabled: !this.props[type],
                        overflow: this.state[`${type}Overflow`]
                    },
                    title: texts[i],
                    ref: el => this[`${type}Element`] = el,
                }, texts[i]))
            )
        )
    }
}

module.exports = TrackInfo

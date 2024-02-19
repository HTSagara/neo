import Base from '../../component/Base.mjs';

/**
 * @class Neo.component.wrapper.MonacoEditor
 * @extends Neo.component.Base
 */
class MonacoEditor extends Base {
    /**
     * Valid values for cursorBlinking
     * @member {String[]} cursorBlinkings=['blink','expand','phase','smooth','solid']
     * @protected
     * @static
     */
    static cursorBlinkings = ['blink', 'expand', 'phase', 'smooth', 'solid']
    /**
     * Valid values for editorTheme
     * @member {String[]} editorThemes=['hc-black','hc-light','vs','vs-dark']
     * @protected
     * @static
     */
    static editorThemes = ['hc-black', 'hc-light', 'vs', 'vs-dark']

    static config = {
        /**
         * @member {String} className='Neo.component.wrapper.MonacoEditor'
         * @protected
         */
        className: 'Neo.component.wrapper.MonacoEditor',
        /**
         * @member {String} ntype='monaco-editor'
         * @protected
         */
        ntype: 'monaco-editor',
        /**
         * @member {Boolean} contextmenu_=false
         */
        contextmenu_: false,
        /**
         * Options are: 'blink', 'expand', 'phase', 'smooth', 'solid'
         * @member {String} cursorBlinking_='blink'
         */
        cursorBlinking_: 'blink',
        /**
         * additional property to only use in combination with readOnly === true.
         * domReadOnly additionally sets the readonly attribute to the underlying textarea.
         * @member {Boolean} domReadOnly_=false
         */
        domReadOnly_: false,
        /**
         * Options are: 'vs', 'vs-dark', 'hc-black', 'hc-light'
         * @member {String} editorTheme_='vs'
         */
        editorTheme_: 'vs',
        /**
         * @member {Number} fontSize_=14
         */
        fontSize_: 14,
        /**
         * @member {String} language_='javascript'
         */
        language_: 'javascript',
        /**
         * @member {Object} minimap_={enabled: false}
         */
        minimap_: {enabled: false},
        /**
         * @member {Boolean} readOnly_=false
         */
        readOnly_: true,
        /**
         * @member {Boolean} showLineNumbers_=true
         */
        showLineNumbers_: true,
        /**
         * @member {String|String[]} value_=''
         */
        value_: ''
    }

    /**
     * @param {Object} config
     */
    construct(config) {
        super.construct(config);

        let me = this;

        me.addDomListeners({
            change: me.onContentChange,
            scope : me
        })
    }

    /**
     * Triggered after the contextmenu config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetContextmenu(value, oldValue) {
        this.setOptions({contextmenu: value})
    }

    /**
     * Triggered after the cursorBlinking config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetCursorBlinking(value, oldValue) {
        this.setOptions({cursorBlinking: value})
    }

    /**
     * Triggered after the domReadOnly config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetDomReadOnly(value, oldValue) {
        this.setOptions({domReadOnly: value})
    }

    /**
     * Triggered after the mounted config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetMounted(value, oldValue) {
        super.afterSetMounted(value, oldValue);

        let me = this;

        if (value) {
            let opts = {
                appName    : me.appName,
                id         : me.id,
                fontSize   : me.fontSize,
                language   : me.language,
                lineNumbers: me.showLineNumbers ? 'on' : 'off',
                minimap    : me.minimap,
                readOnly   : me.readOnly,
                theme      : me.editorTheme,
                value      : me.stringifyValue(me.value)
            };

            setTimeout(() => {
                Neo.main.addon.MonacoEditor.createInstance(opts).then(() => {
                    me.onEditorMounted?.()
                })
            }, 50)
        }
    }

    /**
     * Triggered after the editorTheme config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetEditorTheme(value, oldValue) {
        let me = this;

        if (me.mounted) {
            Neo.main.addon.MonacoEditor.setTheme({
                appName: me.appName,
                id     : me.id,
                value
            })
        }
    }

    /**
     * Triggered after the fontSize config got changed
     * @param {Number} value
     * @param {Number} oldValue
     * @protected
     */
    afterSetFontSize(value, oldValue) {
        this.setOptions({fontSize: value})
    }

    /**
     * Triggered after the language config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetLanguage(value, oldValue) {
        let me = this;

        if (me.mounted) {
            Neo.main.addon.MonacoEditor.setLanguage({
                appName: me.appName,
                id     : me.id,
                value
            })
        }
    }

    /**
     * Triggered after the minimap config got changed
     * @param {Object} value
     * @param {Object} oldValue
     * @protected
     */
    afterSetMinimap(value, oldValue) {
        this.setOptions({minimap: value})
    }

    /**
     * Triggered after the readOnly config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetReadOnly(value, oldValue) {
        this.setOptions({readOnly: value})
    }

    /**
     * Triggered after the showLineNumbers config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetShowLineNumbers(value, oldValue) {
        this.setOptions({lineNumbers: value ? 'on' : 'off'})
    }

    /**
     * Triggered after the value config got changed
     * @param {String|String[]} value
     * @param {String|String[]} oldValue
     * @protected
     */
    afterSetValue(value, oldValue) {
        let me = this;

        if (me.mounted) {
            Neo.main.addon.MonacoEditor.setValue({
                appName: me.appName,
                id     : me.id,
                value  : me.stringifyValue(me.value)
            })
        }
    }

    /**
     * Triggered before the cursorBlinking config gets changed
     * @param {String} value
     * @param {String} oldValue
     * @returns {String}
     * @protected
     */
    beforeSetCursorBlinking(value, oldValue) {
        return this.beforeSetEnumValue(value, oldValue, 'cursorBlinking')
    }

    /**
     * Triggered before the editorTheme config gets changed
     * @param {String} value
     * @param {String} oldValue
     * @returns {String}
     * @protected
     */
    beforeSetEditorTheme(value, oldValue) {
        return this.beforeSetEnumValue(value, oldValue, 'editorTheme')
    }

    /**
     * @param args
     */
    destroy(...args) {
        Neo.main.addon.MonacoEditor.destroyInstance({
            appName: this.appName,
            id     : this.id
        });

        super.destroy(...args)
    }

    /**
     * Fetches the current value from the editor instance
     * @returns {Promise<*>}
     */
    async getEditorValue() {
        return Neo.main.addon.MonacoEditor.getValue({
            appName: this.appName,
            id     : this.id
        })
    }

    /**
     * @param {Object} data
     * @param {Object} data.event
     * @param {String} data.id
     * @param {String} data.value
     */
    onContentChange(data) {
        this.fire('change', data)
    }

    /**
     * @param {Object} options
     */
    setOptions(options) {
        let me = this;

        if (me.mounted) {
            Neo.main.addon.MonacoEditor.setOptions({
                appName: me.appName,
                id     : me.id,
                options
            })
        }
    }

    /**
     *
     * @param {String|String[]} value
     * @returns {String}
     */
    stringifyValue(value) {
        if (Array.isArray(value)) {
            value = value.join('\n')
        }

        return value
    }
}

Neo.applyClassConfig(MonacoEditor);

export default MonacoEditor;

import {
  BaseEventContext,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  getSchemaTpl,
  LayoutBasePlugin,
  RegionWrapper as Region,
  RegionConfig,
  registerEditorPlugin,
  RendererInfo,
  RendererPluginEvent,
  VRenderer,
  VRendererConfig
} from 'amis-editor-core';
import {FlipItemSchema} from 'packages/amis/src/renderers/FlipContainer';
import React from 'react';
import {getEventControlConfig} from '../renderer/event-control';
import {generateId} from '../util';

const sideOptions = [
  {
    label: '正面',
    value: '0'
  },
  {
    label: '背面',
    value: '1'
  }
];

export class FlipContainerPlugin extends LayoutBasePlugin {
  static id = 'FlipContainerPlugin';
  static scene = ['layout'];
  rendererName = 'flip-container';
  $schema = '/schemas/SwitchContainerSchema.json';
  name = '悬停翻转容器';
  isBaseComponent = true;
  description = '悬停翻转容器';
  tags = ['布局容器'];
  docLink = '/amis/zh-CN/components/flip-container';
  order = -2;
  icon = 'fa fa-window-restore';
  pluginIcon = 'flip-container-plugin';
  scaffold = {
    type: 'flip-container',
    items: [
      {
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: '正面内容',
            wrapperComponent: '',
            id: generateId()
          }
        ],
        style: {
          width: '200px',
          height: '200px',
          color: '#fff',
          backgroundColor: '#f06e6e'
        }
      },
      {
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: '背面内容',
            wrapperComponent: '',
            id: generateId()
          }
        ],
        style: {
          width: '200px',
          height: '200px',
          color: '#fff',
          backgroundColor: 'lightblue'
        }
      }
    ],
    effect: 'flip3d',
    style: {
      width: '200px',
      height: '200px',
      margin: '0px auto',
      textAlign: 'center',
      overflow: 'hidden'
    }
  };
  previewSchema = {
    ...this.scaffold
  };
  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区'
    }
  ];
  panelTitle = '翻转容器';
  panelJustify = true;
  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '内容区',
        placeholder: '悬停翻转容器'
      }
    },
    panelTitle: '翻转面',
    panelJustify: true,
    panelBodyCreator: (context: BaseEventContext) => {
      return getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基础',
              body: [
                {
                  name: 'index',
                  label: '翻转面',
                  type: 'select',
                  value: context.info.memberIndex,
                  options: sideOptions,
                  disabled: true
                }
              ]
            }
          ])
        }
      ]);
    }
  };

  overrides = {
    renderBody(this: any, item: FlipItemSchema, index: number) {
      const dom = this.super(item, index);
      const info: RendererInfo = this.props.$$editor;

      if (!info || !info.plugin) {
        return dom;
      }

      const isActive = index === this.state.activeIndex;
      const id = item.$$id || '';
      const plugin: FlipContainerPlugin = info.plugin as FlipContainerPlugin;
      const region = plugin.vRendererConfig?.regions?.body;

      return isActive ? (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          multifactor
          key={id}
          hostId={info.id}
          memberIndex={index}
          name={sideOptions?.[index]?.label}
          id={id}
          draggable={false}
          schemaPath={`${info.schemaPath}/items/${index}`}
          path={`${this.props.$path}/${index}`}
          data={this.props.data}
        >
          {region ? (
            <Region
              key={region.key}
              preferTag={region.preferTag}
              name={region.key}
              label={region.label}
              regionConfig={region}
              placeholder={region.placeholder}
              editorStore={plugin.manager.store}
              manager={plugin.manager}
              children={dom}
              wrapperResolve={region?.wrapperResolve}
              rendererName={info.renderer.name}
            />
          ) : (
            dom
          )}
        </VRenderer>
      ) : null;
    }
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  /**
   * toolbar
   * @param context
   * @param toolbars
   */
  buildEditorToolbar(
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === 'flip-container' &&
      !context.info.hostId
    ) {
      const node = context.node;
      const control = node.getComponent();
      // 切换effect
      toolbars.unshift({
        icon: 'fa fa-magic',
        tooltip: '切换效果',
        placement: 'top',
        id: 'FlipContainer-effect',
        onClick: e => {
          if (this.manager.store.contextMenuPanel) {
            return;
          }
          if (!e.defaultPrevented) {
            const info = (
              e.target as HTMLElement
            ).parentElement!.getBoundingClientRect();
            const x = window.scrollX + info.left + info.width - 24;
            const y = window.scrollY + info.top + info.height + 12;
            this.manager.openContextMenu(context.id, 'effect', {
              x: x,
              y: y
            });
          }
        }
      });

      // 反面
      toolbars.unshift({
        icon: 'fa fa-caret-square-o-up',
        tooltip: '反面',
        onClick: () => {
          if (control?.switchSide) {
            control.switchSide(1);
          }
        }
      });
      // 正面
      toolbars.unshift({
        icon: 'fa fa-caret-square-o-down',
        tooltip: '正面',
        onClick: () => {
          if (control?.switchSide) {
            control.switchSide(0);
          }
        }
      });
    }
  }

  /**
   * flip-container的contextMenu
   */
  buildEditorContextMenu(
    context: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === 'flip-container' &&
      context.region === 'effect'
    ) {
      const node = context.node;
      const currentEffect = node.schema.effect || 'flip3d';

      menus.length = 0;

      menus.push(
        {
          label: '3D翻转',
          selected: currentEffect === 'flip3d',
          onSelect: () => {
            node.updateSchema({effect: 'flip3d'});
          }
        },
        {
          label: '渐入渐出',
          selected: currentEffect === 'fade',
          onSelect: () => {
            node.updateSchema({effect: 'fade'});
          }
        },
        {
          label: '无效果',
          selected: currentEffect === 'none',
          onSelect: () => {
            node.updateSchema({effect: 'none'});
          }
        }
      );
    }
  }

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseover',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseout',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isFreeContainer = curRendererSchema?.isFreeContainer || false;
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

    const displayTpl = [
      getSchemaTpl('layout:display'),

      getSchemaTpl('layout:flex-setting', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")',
        direction: curRendererSchema.direction,
        justify: curRendererSchema.justify,
        alignItems: curRendererSchema.alignItems
      }),

      getSchemaTpl('layout:flex-wrap', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")'
      })
    ];

    return getSchemaTpl('tabs', [
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('theme:base', {
            collapsed: false,
            extra: []
          }),
          {
            title: '布局',
            body: [
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),

              // 自由容器不需要 display 相关配置项
              ...(!isFreeContainer ? displayTpl : []),

              ...(isFlexItem
                ? [
                    getSchemaTpl('layout:flex', {
                      isFlexColumnItem,
                      label: isFlexColumnItem ? '高度设置' : '宽度设置',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative")'
                    }),
                    getSchemaTpl('layout:flex-grow', {
                      visibleOn:
                        'this.style && this.style.flex === "1 1 auto" && (this.style.position === "static" || this.style.position === "relative")'
                    }),
                    getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem ? '弹性高度' : '弹性宽度',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "1 1 auto"'
                    }),
                    getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem ? '固定高度' : '固定宽度',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "0 0 150px"'
                    })
                  ]
                : []),

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  isFlexItem && !isFlexColumnItem
                } && this.style.flex === '0 0 150px'`
              }),

              getSchemaTpl('layout:isFixedHeight', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  context?.node.setHeightMutable(value);
                }
              }),
              getSchemaTpl('layout:height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:overflow-y', {
                visibleOn: `${
                  !isFlexItem || !isFlexColumnItem
                } && (this.isFixedHeight || this.style && this.style.maxHeight) || (${
                  isFlexItem && isFlexColumnItem
                } && this.style.flex === '0 0 150px')`
              }),

              getSchemaTpl('layout:isFixedWidth', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  context?.node.setWidthMutable(value);
                }
              }),
              getSchemaTpl('layout:width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } && (this.isFixedWidth || this.style && this.style.maxWidth)`
              }),

              !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
              !isFlexItem && !isFreeContainer
                ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: '内部对齐方式',
                    visibleOn:
                      'this.style && this.style.display !== "flex" && this.style.display !== "inline-flex"'
                  })
                : null,
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          },
          {
            title: '自定义样式',
            body: [
              {
                type: 'theme-cssCode',
                label: false
              }
            ]
          }
        ])
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };
}

registerEditorPlugin(FlipContainerPlugin);

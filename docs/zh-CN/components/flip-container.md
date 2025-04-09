---
title: 悬停翻转容器
description: 支持正面和背面两个状态，当鼠标悬停时会自动翻转显示背面内容
type: 0
group: ⚙ 组件
menuName: 悬停翻转容器
---

Flip Container 支持正面和背面两个状态，当鼠标悬停时会自动翻转显示背面内容。

## 翻转效果

组件支持三种翻转效果：

1. `flip3d`（默认）：3D 翻转效果
2. `fade`：渐入渐出效果
3. `none`：无效果

可以通过 `effect` 属性设置：

```schema
{
  "type": "flip-container",
  "effect": "flip3d",
  "items": [
    {
      "body": [
        {
          "type": "tpl",
          "tpl": "正面内容"
        }
      ],
      "style": {
        "width": "200px",
        "height": "200px",
        "color": "#fff",
        "backgroundColor": "lightcoral",
      },
    },
    {
      "body": [
        {
          "type": "tpl",
          "tpl": "背面内容"
        }
      ],
      "style": {
        "width": "200px",
        "height": "200px",
        "color": "#fff",
        "backgroundColor": "lightblue",
      },
    }
  ],
  "style": {
    "display": "block",
    "overflowX": "visible",
    "width": "200px",
    "height": "200px",
    "margin": "0px auto",
    "textAlign": "center",
  }
}
```

## FlipContainer 属性

| 属性名    | 类型                                                         | 默认值             | 说明                         |
| --------- | ------------------------------------------------------------ | ------------------ | ---------------------------- |
| type      | `string`                                                     | `"flip-container"` | 指定为 flip-container 渲染器 |
| className | `string`                                                     |                    | 外层 Dom 的类名              |
| effect    | `string`                                                     | `"flip3d"`         | 翻转效果                     |
| style     | `Object`                                                     |                    | 自定义样式                   |
| items     | [FlipContanerItem[]](./flip-container#flipcontaneritem-属性) |                    | 容器内容                     |

## FlipContanerItem 属性

| 属性名    | 类型                                      | 默认值 | 说明       |
| --------- | ----------------------------------------- | ------ | ---------- |
| style     | `Object`                                  |        | 自定义样式 |
| className | `string`                                  |        | 自定义类名 |
| body      | [SchemaNode](../../docs/types/schemanode) |        | 当前面内容 |

## 事件表

> 3.3.0 及以上版本

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称  | 事件参数 | 说明           |
| --------- | -------- | -------------- |
| click     | -        | 点击时触发     |
| mouseover | -        | 鼠标移入时触发 |
| mouseout  | -        | 鼠标移出时触发 |

### click

鼠标点击。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
    "type": "flip-container",
    "effect": "none",
    "items": [
      {
        "body": [
          {
            "type": "tpl",
            "tpl": "正面内容"
          }
        ],
        "style": {
          "width": "200px",
          "height": "200px",
          "color": "#fff",
          "backgroundColor": "lightcoral",
        },
      },
      {
        "body": [
          {
            "type": "tpl",
            "tpl": "背面内容"
          }
        ],
        "style": {
          "width": "200px",
          "height": "200px",
          "color": "#fff",
          "backgroundColor": "lightblue",
        },
      }
    ],
    "style": {
      "display": "block",
      "overflowX": "visible",
      "width": "200px",
      "height": "200px",
      "margin": "0px auto",
      "textAlign": "center",
    },
    "onEvent": {
        "click": {
            "actions": [
                {
                    "actionType": "toast",
                    "args": {
                        "msgType": "info",
                        "msg": "${event.context.nativeEvent.type}"
                    }
                }
            ]
        }
    }
}
```

### mouseover

鼠标移入。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
    "type": "flip-container",
    "effect": "none",
    "items": [
      {
        "body": [
          {
            "type": "tpl",
            "tpl": "正面内容"
          }
        ],
        "style": {
          "width": "200px",
          "height": "200px",
          "color": "#fff",
          "backgroundColor": "lightcoral",
        },
      },
      {
        "body": [
          {
            "type": "tpl",
            "tpl": "背面内容"
          }
        ],
        "style": {
          "width": "200px",
          "height": "200px",
          "color": "#fff",
          "backgroundColor": "lightblue",
        },
      }
    ],
    "style": {
      "display": "block",
      "overflowX": "visible",
      "width": "200px",
      "height": "200px",
      "margin": "0px auto",
      "textAlign": "center",
    },
    "onEvent": {
        "mouseover": {
            "actions": [
                {
                    "actionType": "toast",
                    "args": {
                        "msgType": "info",
                        "msg": "${event.context.nativeEvent.type}"
                    }
                }
            ]
        }
    }
}
```

### mouseout

鼠标移出。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
    "type": "flip-container",
    "effect": "none",
    "items": [
      {
        "body": [
          {
            "type": "tpl",
            "tpl": "正面内容"
          }
        ],
        "style": {
          "width": "200px",
          "height": "200px",
          "color": "#fff",
          "backgroundColor": "lightcoral",
        },
      },
      {
        "body": [
          {
            "type": "tpl",
            "tpl": "背面内容"
          }
        ],
        "style": {
          "width": "200px",
          "height": "200px",
          "color": "#fff",
          "backgroundColor": "lightblue",
        },
      }
    ],
    "style": {
      "display": "block",
      "overflowX": "visible",
      "width": "200px",
      "height": "200px",
      "margin": "0px auto",
      "textAlign": "center",
    },
    "onEvent": {
        "mouseout": {
            "actions": [
                {
                    "actionType": "toast",
                    "args": {
                        "msgType": "info",
                        "msg": "${event.context.nativeEvent.type}"
                    }
                }
            ]
        }
    }
}
```

## 注意事项

1. 组件默认使用 3D 翻转效果，可以根据需要切换为其他效果
2. 正面和背面内容都可以包含任意 amis 组件
3. 建议设置合适的容器尺寸，以确保翻转效果正常显示

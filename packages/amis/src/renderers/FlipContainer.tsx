import {
  autobind,
  buildStyle,
  CustomStyle,
  Renderer,
  RendererProps,
  setThemeClassName
} from 'amis-core';
import React from 'react';
import {BaseSchema, SchemaCollection} from '../Schema';
import {JSONSchema} from '../types';

export interface FlipItemSchema extends Omit<BaseSchema, 'type'> {
  /**
   * 内容
   */
  body?: SchemaCollection;
}

/**
 * 翻转效果
 * 1. flip3d 3D翻转（默认效果）
 * 2. fade 渐入渐出
 * 3. none 无效果
 */
type EffectType = 'flip3d' | 'fade' | 'none';

/**
 * FlipContainer Schema
 */
export interface FlipContainerSchema extends BaseSchema {
  /**
   * 指定为 flip-container 类型
   */
  type: 'flip-container';

  /**
   * 状态项列表
   * 第一项为正面，第二项为反面
   * 如果只有一项，则正反面都显示该项
   */
  items: Array<FlipItemSchema>;

  /**
   * 翻转效果
   */
  effect?: EffectType;
}

export interface FlipContainerProps
  extends RendererProps,
    Omit<FlipContainerSchema, 'type' | 'className' | 'style'> {
  children?: (props: FlipContainerProps) => React.ReactNode;
}

export interface FlipContainerState {
  /**
   * 当前激活的面索引
   */
  activeIndex: number;
}

/**
 * 悬停翻转容器
 */
export default class FlipContainer extends React.Component<
  FlipContainerProps,
  FlipContainerState
> {
  static propsList: Array<string> = ['body', 'className'];
  static defaultProps = {
    className: '',
    effect: 'flip3d'
  };

  constructor(props: FlipContainerProps) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }

  @autobind
  handleClick(e: React.MouseEvent<Element>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseOver(e: React.MouseEvent<Element>) {
    const target = e.currentTarget;
    const relatedTarget = e.relatedTarget as HTMLElement;

    // 鼠标是在组件内部移动，不触发
    if (relatedTarget && target.contains(relatedTarget)) {
      return;
    }

    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);

    this.setState({
      activeIndex: 1 - this.state.activeIndex
    });
  }

  @autobind
  handleMouseOut(e: React.MouseEvent<Element>) {
    const target = e.currentTarget;
    const relatedTarget = e.relatedTarget as HTMLElement;

    // 鼠标是在组件内部移动，不触发
    if (relatedTarget && target.contains(relatedTarget)) {
      return;
    }

    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);

    this.setState({
      activeIndex: 1 - this.state.activeIndex
    });
  }

  @autobind
  switchSide(index: number) {
    const items = this.props.items || [];
    if (
      index >= 0 &&
      (index < items.length || (index === 1 && items.length === 1))
    ) {
      this.setState({
        activeIndex: index
      });
    }
  }

  @autobind
  renderBody(item: JSONSchema, index: number): JSX.Element | null {
    const {children, render, disabled, classnames: cx, data} = this.props;
    const {body, style: itemStyle, className: itemClassName} = item;

    const side = index === 0 ? 'front' : 'back';

    const containerBody = children
      ? typeof children === 'function'
        ? (children(this.props) as JSX.Element)
        : (children as JSX.Element)
      : body
      ? (render('body', body, {disabled, data}) as JSX.Element)
      : null;

    return (
      <div
        data-side={side}
        key={side}
        style={buildStyle(itemStyle, data)}
        className={cx('FlipContainer-item', side, itemClassName)}
      >
        {containerBody}
      </div>
    );
  }

  render() {
    const {
      className,
      items = [],
      classnames: cx,
      style,
      data,
      id,
      wrapperCustomStyle,
      env,
      themeCss,
      effect = 'flip3d'
    } = this.props;
    const {activeIndex} = this.state;

    const itemsToRender = items.length > 0 ? [...items] : [];

    // 如果只有一项，则将其复制到第二项
    if (itemsToRender.length === 1) {
      itemsToRender.push({...itemsToRender[0]});
    }

    const activeSide = activeIndex === 0 ? 'front' : 'back';

    const contentDom = (
      <div
        className={cx(
          'FlipContainer',
          `FlipContainer--${effect}`,
          className,
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        style={buildStyle(style, data)}
        data-role="container"
        data-active-side={activeSide}
      >
        <div className={cx('FlipContainer-inner')}>
          {itemsToRender.map((item, index) => this.renderBody(item, index))}
        </div>

        <CustomStyle
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
      </div>
    );

    return contentDom;
  }
}

/**
 * 悬停翻转容器渲染器
 */
@Renderer({
  type: 'flip-container'
})
export class FlipContainerRenderer extends FlipContainer {}

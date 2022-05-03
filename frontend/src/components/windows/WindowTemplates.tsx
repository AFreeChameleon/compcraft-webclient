import styled from 'styled-components';

export const Root = styled.div`
  position: absolute;
  user-select: none;
  border: 1px solid #00AF00;
`;

export const WindowHeader = styled.div`
  width: 100%;
  height: 30px;
  background-color: #00AF00;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`;

export const WindowHeaderText = styled.div`
  display: flex;
  flex-grow: 1;
  column-gap: 15px;
  align-items: center;
  height: 100%;
  color: #ffffff;
  padding-left: 15px;
`;

export const WindowOptions = styled.div`
  display: flex;
`;

export const WindowButton = styled.div`
  height: 100%;
  width: 40px;
  display: grid;
  place-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 30%;
  user-select: contain;

  &.minimise {
    background-image: url('/img/minimise.png');
  }
  &.maximise {
    background-image: url('/img/maximise.png');
  }
  &.exit {
    background-image: url('/img/exit.png');
  }

  &:hover {
    background-color: #007A2A;
  }
`;

export const WindowBody = styled.div`
  width: 100%;
  height: calc(100% - 30px);
  background-color: #ffffff;
`;


export const Options = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-bottom: 2px solid #e5e5e5;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

export const Option = styled.div`

`;

export const OptionText = styled.div`
  padding: 0 5px;
  line-height: 20px;
  &:hover {
    background-color: #00AF00;
    color: #ffffff;
  }
`;

export const OptionMenu = styled.div`
  position: absolute;
  left: 8px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  color: #000000;
  width: 200px;
`;

export const OptionMenuItem = styled.div`
  line-height: 20px;
  padding: 0 5px;
  &:hover {
    background-color: #00AF0021;
  }
`;
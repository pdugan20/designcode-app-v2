import React from 'react';
import styled from 'styled-components';
import { Icon } from 'expo';

const MenuItem = props => (
    <Container>
        <IconView>
            <Icon.Ionicons name={props.icon} size={24} color='#546bfb' />
        </IconView>
        <Content>
            <Title>{props.title}</Title>
            <Text>{props.text}</Text>
        </Content>
    </Container>
);

export default MenuItem;

const Container = styled.View`
    flex-direction: row;
    margin: 15px 0;
`;

const IconView = styled.View`
    width: 32;
    height: 32;
    justify-content: center;
    align-items: center;
`;

const Content = styled.View`
    padding-left: 20;
`;

const Title = styled.Text`
    color: #3c4560;
    font-size: 24;
    font-weight: 600;
`;

const Text = styled.Text`
    color: #3c4560;
    font-weight: 600;
    opacity: 0.6;
    margin-top: 5px;
`;

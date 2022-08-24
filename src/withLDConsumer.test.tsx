import { LDFlagSet } from 'launchdarkly-js-client-sdk';

interface HocProps {
  flags?: LDFlagSet;
  ldClient?: { track: jest.Mock };
}

jest.mock('./context', () => {
  interface ConsumerChildren {
    children(props: HocProps): React.ReactNode;
  }

  return {
    // tslint:disable-next-line:no-null-undefined-union
    Consumer(props: ConsumerChildren) {
      return props.children({ flags: { testFlag: true }, ldClient: { track: jest.fn() } });
    },
  };
});

import * as React from 'react';
import { create } from 'react-test-renderer';
import withLDConsumer, { LDProps } from './withLDConsumer';

describe('withLDConsumer', () => {
  interface HomeProps extends Pick<LDProps, 'ldClient'> {
    flags: {
      testFlag: boolean;
    };
  }

  test('flags are passed down through context api', () => {
    const Home = (props: HomeProps) => (
      <div>{props.flags && props.flags.testFlag ? 'testFlag detected' : 'Negative, no flag'}</div>
    );
    const HomeWithFlags = withLDConsumer()(Home);
    const component = create(<HomeWithFlags />);
    expect(component).toMatchSnapshot();
  });

  test('ldClient is passed down through context api', () => {
    const Home = (props: HomeProps) => <div>{props.ldClient ? 'ldClient detected' : 'Negative, no ldClient'}</div>;
    const HomeWithFlags = withLDConsumer()(Home);
    const component = create(<HomeWithFlags />);
    expect(component).toMatchSnapshot();
  });

  test('only ldClient is passed down through context api', () => {
    const Home = (props: HomeProps) => (
      <div>
        {props.flags ? 'flags detected' : 'Negative, no flag'}
        {props.ldClient ? 'ldClient detected' : 'Negative, no ldClient'}
      </div>
    );
    const HomeWithFlags = withLDConsumer({ clientOnly: true })(Home);
    const component = create(<HomeWithFlags />);
    expect(component).toMatchSnapshot();
  });
});

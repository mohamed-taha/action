import React, {Component} from 'react';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import Example from '../../components/Example/Example';
import ExampleCode from '../../components/ExampleCode/ExampleCode';
import PropsTable from '../../components/PropsTable/PropsTable';
import Avatar from 'universal/components/Avatar/Avatar';

const avatar = <Avatar hasLabel size="largest" />;
const avatarString = '<Avatar hasLabel size="largest" />';
const avatarPropsList = [
  { name: 'isCheckedIn', type: 'bool',
    description: <span>true if the user has checked in</span>
  },
  { name: 'isConnected', type: 'bool',
    description: <span>true if the user has a presence</span>
  },
  { name: 'hasLabel', type: 'bool',
    description: <span>Shows a label with the avatar image</span>
  },
  { name: 'hasTooltip', type: 'bool',
    description: <span>Shows a tooltip on hover</span>
  },
  { name: 'picture', type: 'string',
    description: <span>The source of the image. A URL or data-uri.</span>
  },
  { name: 'labelRight', type: 'bool',
    description: <span>Moves label to the right of the avatar image</span>
  },
  { name: 'preferredName', type: 'string',
    // eslint-disable-next-line max-len
    description: <span>This is the text for the label and/or tooltip, typically a name or username.</span>
  },
  { name: 'onClick', type: 'func',
    description: <span>Handles clicking the avatar component</span>
  },
  { name: 'size', type: 'oneOf',
    description: <span>smallest, small, medium, large, largest</span>
  }
];

// eslint-disable-next-line react/prefer-stateless-function
export default class AvatarContainer extends Component {
  static propTypes = {
    // Define
  };

  render() {
    return (
      <div>

        <SectionHeader
          heading="Avatar"
          // eslint-disable-next-line max-len
          description="An avatar component with optional sizing, layout, label, tooltip and badges"
        />

        <Example>
          {avatar}
          <ExampleCode>
            {avatarString}
          </ExampleCode>
        </Example>

        <PropsTable propsList={avatarPropsList} />

      </div>
    );
  }
}

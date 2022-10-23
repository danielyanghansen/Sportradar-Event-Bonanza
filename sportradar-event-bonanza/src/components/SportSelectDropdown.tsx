import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';

export type SportSelectionProps = {
  sportIdList: number[];
  onClick: (sportId: number) => void;
};

const SportSelectDropdown = ({ sportIdList, onClick }: SportSelectionProps) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select Sport
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {sportIdList.map((sportId: number) => {
          return (
            <Dropdown.Item
              onClick={() => {
                onClick(sportId);
              }}
            >
              {sportId}
              <Image
                src={
                  'https://img.sportradar.com/ls/sports/big/' +
                  sportId.toString() +
                  '.png'
                }
                style={{ maxHeight: '10px' }}
              />
            </Dropdown.Item>
          );
        })}
        ;
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SportSelectDropdown;

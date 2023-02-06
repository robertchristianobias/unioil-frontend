import React from 'react';
import { Chart } from 'react-charts'

export function Dashboard()
{
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      {
        label: 'Series 2',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ],
    []
  );
  
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  );

  return (
    <div className="row m-0 p-3">
      <div className="col-md-6">
        <div 
          style={{
            width: '400px',
            height: '300px'
          }}
        >
          <p>Sales Order</p>
          {
            <Chart 
              data={data} 
              axes={axes} 
            />
          }
        </div>
        
      </div>
      <div className="col-md-6"></div>
    </div>
  );
}

export default Dashboard;
